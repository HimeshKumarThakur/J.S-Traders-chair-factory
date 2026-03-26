import { promises as fs } from 'fs';
import path from 'path';
import { Redis } from '@upstash/redis';
import type { AdminData, AdminProduct, ProductOverride } from '../../types/adminData';

const ADMIN_DATA_KEY = 'js-traders-admin-data-v1';

const storePath = process.env.VERCEL
  ? '/tmp/js-traders-admin-data.json'
  : path.join(process.cwd(), 'data', 'admin-data.json');

const emptyStore = (): AdminData => ({ products: [], overrides: [], popupMessage: "" });

const getRedisRestUrl = () => process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL || '';

const getRedisRestToken = () => process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN || '';

const hasUpstashConfig = () =>
  Boolean(getRedisRestUrl() && getRedisRestToken());

const normalizeStore = (input: unknown): AdminData => {
  if (!input || typeof input !== 'object') return emptyStore();

  const maybe = input as Partial<AdminData>;
  const products = Array.isArray(maybe.products) ? maybe.products : [];
  const overrides = Array.isArray(maybe.overrides) ? maybe.overrides : [];

  const normalizedProducts = products.flatMap((item) => {
    if (
      typeof item !== 'object' ||
      item === null ||
      typeof (item as AdminProduct).id !== 'string' ||
      typeof (item as AdminProduct).title !== 'string' ||
      typeof (item as AdminProduct).image !== 'string' ||
      typeof (item as AdminProduct).price !== 'number' ||
      typeof (item as AdminProduct).createdAt !== 'string'
    ) {
      return [];
    }

    const candidate = item as AdminProduct & { soldOut?: boolean };
    return [{ ...candidate, soldOut: Boolean(candidate.soldOut) }];
  });

  const normalizedOverrides = overrides.flatMap((item) => {
    if (
      typeof item !== 'object' ||
      item === null ||
      typeof (item as ProductOverride).id !== 'string' ||
      typeof (item as ProductOverride).title !== 'string' ||
      typeof (item as ProductOverride).image !== 'string' ||
      typeof (item as ProductOverride).price !== 'number' ||
      typeof (item as ProductOverride).updatedAt !== 'string'
    ) {
      return [];
    }

    const candidate = item as ProductOverride & { soldOut?: boolean };
    return [{ ...candidate, soldOut: Boolean(candidate.soldOut) }];
  });

  // Always ensure popupMessage exists, even if missing in Upstash/Redis or old data
  let popupMessage = "";
  if (typeof (input as any).popupMessage === 'string') {
    popupMessage = (input as any).popupMessage;
  } else if (maybe && 'popupMessage' in maybe && typeof maybe.popupMessage === 'string') {
    popupMessage = maybe.popupMessage;
  }

  return {
    products: normalizedProducts,
    overrides: normalizedOverrides,
    popupMessage,
  };
};

type StorageBackend = 'upstash' | 'file';

type StorageAdapter = {
  backend: StorageBackend;
  read: () => Promise<AdminData>;
  write: (data: AdminData) => Promise<void>;
  probe: () => Promise<{ attempted: boolean; success: boolean; key?: string; valueMatched?: boolean; error?: string }>;
};

let upstashClient: Redis | null = null;

const getUpstashClient = () => {
  if (upstashClient) return upstashClient;

  const url = getRedisRestUrl();
  const token = getRedisRestToken();
  if (!url || !token) {
    throw new Error(
      'Missing Redis REST credentials. Set UPSTASH_REDIS_REST_URL/TOKEN or KV_REST_API_URL/TOKEN.',
    );
  }

  upstashClient = new Redis({ url, token });
  return upstashClient;
};

const ensureStoreFile = async () => {
  await fs.mkdir(path.dirname(storePath), { recursive: true });
  try {
    await fs.access(storePath);
  } catch {
    await fs.writeFile(storePath, JSON.stringify(emptyStore(), null, 2), 'utf-8');
  }
};

const fileStorageAdapter: StorageAdapter = {
  backend: 'file',
  read: async () => {
    await ensureStoreFile();
    try {
      const raw = await fs.readFile(storePath, 'utf-8');
      return normalizeStore(JSON.parse(raw));
    } catch {
      return emptyStore();
    }
  },
  write: async (data) => {
    await ensureStoreFile();
    await fs.writeFile(storePath, JSON.stringify(data, null, 2), 'utf-8');
  },
  probe: async () => ({ attempted: false, success: false }),
};

const upstashStorageAdapter: StorageAdapter = {
  backend: 'upstash',
  read: async () => {
    const client = getUpstashClient();
    const value = await client.get<AdminData>(ADMIN_DATA_KEY);
    return normalizeStore(value ?? emptyStore());
  },
  write: async (data) => {
    const client = getUpstashClient();
    await client.set(ADMIN_DATA_KEY, data);
  },
  probe: async () => {
    const key = `js-traders-upstash-probe:${Date.now()}`;
    const probeValue = { ok: true, ts: Date.now() };

    try {
      const client = getUpstashClient();
      await client.set(key, probeValue, { ex: 60 });
      const readValue = await client.get<typeof probeValue>(key);
      const valueMatched = Boolean(readValue && readValue.ok === probeValue.ok);
      await client.del(key);

      return {
        attempted: true,
        success: valueMatched,
        key,
        valueMatched,
      };
    } catch (error) {
      return {
        attempted: true,
        success: false,
        key,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  },
};

const getPrimaryStorageAdapter = (): StorageAdapter =>
  hasUpstashConfig() ? upstashStorageAdapter : fileStorageAdapter;

export const getAdminStorageInfo = (): {
  activeBackend: StorageBackend;
  hasUpstashConfig: boolean;
  env: {
    UPSTASH_REDIS_REST_URL: boolean;
    UPSTASH_REDIS_REST_TOKEN: boolean;
    UPSTASH_REDIS_REST_READ_ONLY_TOKEN: boolean;
    KV_REST_API_URL: boolean;
    KV_REST_API_TOKEN: boolean;
    KV_REST_API_READ_ONLY_TOKEN: boolean;
  };
  usesEphemeralFileFallbackOnVercel: boolean;
} => {
  const configured = hasUpstashConfig();
  return {
    activeBackend: configured ? 'upstash' : 'file',
    hasUpstashConfig: configured,
    env: {
      UPSTASH_REDIS_REST_URL: Boolean(process.env.UPSTASH_REDIS_REST_URL),
      UPSTASH_REDIS_REST_TOKEN: Boolean(process.env.UPSTASH_REDIS_REST_TOKEN),
      UPSTASH_REDIS_REST_READ_ONLY_TOKEN: Boolean(process.env.UPSTASH_REDIS_REST_READ_ONLY_TOKEN),
      KV_REST_API_URL: Boolean(process.env.KV_REST_API_URL),
      KV_REST_API_TOKEN: Boolean(process.env.KV_REST_API_TOKEN),
      KV_REST_API_READ_ONLY_TOKEN: Boolean(process.env.KV_REST_API_READ_ONLY_TOKEN),
    },
    usesEphemeralFileFallbackOnVercel: Boolean(process.env.VERCEL) && !configured,
  };
};

export const readAdminData = async (): Promise<AdminData> => {
  const primary = getPrimaryStorageAdapter();
  try {
    return await primary.read();
  } catch (error) {
    if (primary.backend === 'upstash') {
      console.error('[AdminStorage] Upstash read failed, falling back to file:', error);
      return fileStorageAdapter.read();
    }
    throw error;
  }
};

export const writeAdminData = async (data: AdminData) => {
  const primary = getPrimaryStorageAdapter();
  try {
    await primary.write(data);
  } catch (error) {
    if (primary.backend === 'upstash') {
      console.error('[AdminStorage] Upstash write failed, falling back to file:', error);
      await fileStorageAdapter.write(data);
      return;
    }
    throw error;
  }
};

export const probeAdminStorage = async () => {
  const primary = getPrimaryStorageAdapter();
  if (primary.backend !== 'upstash') {
    return { attempted: false, success: false };
  }
  return primary.probe();
};
