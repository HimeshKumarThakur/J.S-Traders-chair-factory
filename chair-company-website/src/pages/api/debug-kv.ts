import type { NextApiRequest, NextApiResponse } from 'next';
import { readAdminDataStore } from '../../lib/adminDataStore';

type ResponseData = {
  env: {
    hasKvConfig: boolean;
    hasMysqlConfig: boolean;
    nodeEnv: string;
    vercel: boolean;
  };
  kvVars: {
    KV_REST_API_URL: boolean;
    KV_REST_API_TOKEN: boolean;
    KV_REST_API_READ_ONLY_TOKEN: boolean;
    KV_URL: boolean;
    REDIS_URL: boolean;
  };
  currentData: {
    products: number;
    overrides: number;
  };
  success: boolean;
  message: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  try {
    const hasKvConfig = Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
    const hasMysqlConfig = Boolean(
      process.env.MYSQL_URL ||
        (process.env.MYSQL_HOST && process.env.MYSQL_USER && process.env.MYSQL_PASSWORD && process.env.MYSQL_DATABASE),
    );

    const data = await readAdminDataStore();

    res.status(200).json({
      env: {
        hasKvConfig,
        hasMysqlConfig,
        nodeEnv: process.env.NODE_ENV || 'unknown',
        vercel: Boolean(process.env.VERCEL),
      },
      kvVars: {
        KV_REST_API_URL: Boolean(process.env.KV_REST_API_URL),
        KV_REST_API_TOKEN: Boolean(process.env.KV_REST_API_TOKEN),
        KV_REST_API_READ_ONLY_TOKEN: Boolean(process.env.KV_REST_API_READ_ONLY_TOKEN),
        KV_URL: Boolean(process.env.KV_URL),
        REDIS_URL: Boolean(process.env.REDIS_URL),
      },
      currentData: {
        products: data.products.length,
        overrides: data.overrides.length,
      },
      success: true,
      message: `Great! Data store is working. Found ${data.products.length} products and ${data.overrides.length} overrides.`,
    });
  } catch (error) {
    res.status(500).json({
      env: {
        hasKvConfig: Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN),
        hasMysqlConfig: Boolean(
          process.env.MYSQL_URL ||
            (process.env.MYSQL_HOST && process.env.MYSQL_USER && process.env.MYSQL_PASSWORD && process.env.MYSQL_DATABASE),
        ),
        nodeEnv: process.env.NODE_ENV || 'unknown',
        vercel: Boolean(process.env.VERCEL),
      },
      kvVars: {
        KV_REST_API_URL: Boolean(process.env.KV_REST_API_URL),
        KV_REST_API_TOKEN: Boolean(process.env.KV_REST_API_TOKEN),
        KV_REST_API_READ_ONLY_TOKEN: Boolean(process.env.KV_REST_API_READ_ONLY_TOKEN),
        KV_URL: Boolean(process.env.KV_URL),
        REDIS_URL: Boolean(process.env.REDIS_URL),
      },
      currentData: {
        products: 0,
        overrides: 0,
      },
      success: false,
      message: `Error: ${error instanceof Error ? error.message : String(error)}`,
    });
  }
}
