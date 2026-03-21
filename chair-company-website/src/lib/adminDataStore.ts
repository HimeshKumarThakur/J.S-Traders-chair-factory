import { promises as fs } from 'fs';
import path from 'path';
import mysql from 'mysql2/promise';
import { kv } from '@vercel/kv';
import type { AdminData, AdminProduct, ProductOverride } from '../types/adminData';

const ADMIN_DATA_MYSQL_KEY = 'js-traders-admin-data-v1';
const ADMIN_DATA_KV_KEY = 'js-traders-admin-data-v1';

const hasMysqlConfig = () =>
  Boolean(
    process.env['MYSQL_URL'] ||
      (process.env['MYSQL_HOST'] &&
        process.env['MYSQL_USER'] &&
        process.env['MYSQL_PASSWORD'] &&
        process.env['MYSQL_DATABASE']),
  );

const hasKvConfig = () =>
  Boolean(
    (process.env['KV_REST_API_URL'] && process.env['KV_REST_API_TOKEN']) ||
      (process.env['UPSTASH_REDIS_REST_URL'] && process.env['UPSTASH_REDIS_REST_TOKEN']) ||
      process.env['KV_URL'] ||
      process.env['REDIS_URL'],
  );

let mysqlPool: mysql.Pool | null = null;

const storePath = process.env.VERCEL
  ? '/tmp/js-traders-admin-data.json'
  : path.join(process.cwd(), 'data', 'admin-data.json');

const emptyStore = (): AdminData => ({ products: [], overrides: [] });

const getMysqlPool = () => {
  if (mysqlPool) return mysqlPool;

  if (process.env.MYSQL_URL) {
    mysqlPool = mysql.createPool({
      uri: process.env.MYSQL_URL,
      connectionLimit: 5,
      waitForConnections: true,
      queueLimit: 0,
      ssl: process.env.MYSQL_SSL === 'false' ? undefined : { rejectUnauthorized: false },
    });
    return mysqlPool;
  }

  mysqlPool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    port: Number(process.env.MYSQL_PORT || 3306),
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    connectionLimit: 5,
    waitForConnections: true,
    queueLimit: 0,
    ssl: process.env.MYSQL_SSL === 'false' ? undefined : { rejectUnauthorized: false },
  });

  return mysqlPool;
};

const ensureMysqlStoreTable = async () => {
  const pool = getMysqlPool();
  await pool.query(`
    CREATE TABLE IF NOT EXISTS js_traders_admin_store (
      store_key VARCHAR(64) NOT NULL PRIMARY KEY,
      data JSON NOT NULL,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);
};

const readFromMysql = async (): Promise<AdminData> => {
  await ensureMysqlStoreTable();
  const pool = getMysqlPool();
  const [rows] = await pool.query<mysql.RowDataPacket[]>(
    'SELECT data FROM js_traders_admin_store WHERE store_key = ? LIMIT 1',
    [ADMIN_DATA_MYSQL_KEY],
  );

  if (!rows[0]?.data) return emptyStore();

  const payload = typeof rows[0].data === 'string' ? JSON.parse(rows[0].data) : rows[0].data;
  return normalizeStore(payload);
};

const writeToMysql = async (data: AdminData) => {
  await ensureMysqlStoreTable();
  const pool = getMysqlPool();
  await pool.query(
    `
      INSERT INTO js_traders_admin_store (store_key, data)
      VALUES (?, CAST(? AS JSON))
      ON DUPLICATE KEY UPDATE data = VALUES(data), updated_at = CURRENT_TIMESTAMP
    `,
    [ADMIN_DATA_MYSQL_KEY, JSON.stringify(data)],
  );
};

const ensureStoreFile = async () => {
  await fs.mkdir(path.dirname(storePath), { recursive: true });
  try {
    await fs.access(storePath);
  } catch {
    await fs.writeFile(storePath, JSON.stringify(emptyStore(), null, 2), 'utf-8');
  }
};

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

  return {
    products: normalizedProducts,
    overrides: normalizedOverrides,
  };
};

export const readAdminDataStore = async (): Promise<AdminData> => {
  const mysqlEnabled = hasMysqlConfig();
  const kvEnabled = hasKvConfig();
  console.log('[AdminDataStore] Reading data... hasMysql:', mysqlEnabled, 'hasKv:', kvEnabled);
  
  if (mysqlEnabled) {
    try {
      console.log('[AdminDataStore] Attempting MySQL read...');
      return await readFromMysql();
    } catch (error) {
      console.error('[AdminDataStore] MySQL read failed:', error);
    }
  }

  if (kvEnabled) {
    try {
      console.log('[AdminDataStore] Attempting KV read from key:', ADMIN_DATA_KV_KEY);
      const value = await kv.get<AdminData>(ADMIN_DATA_KV_KEY);
      console.log('[AdminDataStore] KV read success, data exists:', !!value);
      return normalizeStore(value ?? emptyStore());
    } catch (error) {
      console.error('[AdminDataStore] KV read failed:', error);
      if (process.env.VERCEL) {
        return emptyStore();
      }
    }
  }

  if (process.env.VERCEL) {
    console.error('[AdminDataStore] No persistent store available on Vercel.');
    return emptyStore();
  }

  console.log('[AdminDataStore] Falling back to file store...');
  await ensureStoreFile();
  try {
    const raw = await fs.readFile(storePath, 'utf-8');
    return normalizeStore(JSON.parse(raw));
  } catch {
    return emptyStore();
  }
};

export const writeAdminDataStore = async (data: AdminData) => {
  const mysqlEnabled = hasMysqlConfig();
  const kvEnabled = hasKvConfig();
  console.log('[AdminDataStore] Writing data... hasMysql:', mysqlEnabled, 'hasKv:', kvEnabled, 'products:', data.products.length, 'overrides:', data.overrides.length);
  
  if (mysqlEnabled) {
    try {
      console.log('[AdminDataStore] Writing to MySQL...');
      await writeToMysql(data);
      console.log('[AdminDataStore] MySQL write success');
      return;
    } catch (error) {
      console.error('[AdminDataStore] MySQL write failed:', error);
    }
  }

  if (kvEnabled) {
    try {
      console.log('[AdminDataStore] Writing to KV with key:', ADMIN_DATA_KV_KEY);
      await kv.set(ADMIN_DATA_KV_KEY, data);
      console.log('[AdminDataStore] KV write success');
      return;
    } catch (error) {
      console.error('[AdminDataStore] KV write failed:', error);
      if (process.env.VERCEL) {
        throw new Error('Persistent KV write failed on Vercel. Data was not saved.');
      }
    }
  }

  if (process.env.VERCEL) {
    throw new Error('No persistent store configured on Vercel. Data was not saved.');
  }

  console.log('[AdminDataStore] Writing to file store...');
  await ensureStoreFile();
  await fs.writeFile(storePath, JSON.stringify(data, null, 2), 'utf-8');
  console.log('[AdminDataStore] File write success');
};
