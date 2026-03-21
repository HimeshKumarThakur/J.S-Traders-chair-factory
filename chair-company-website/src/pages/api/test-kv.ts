import type { NextApiRequest, NextApiResponse } from 'next';
import { readAdminDataStore, writeAdminDataStore } from '../../lib/adminDataStore';

type ResponseData = {
  action: string;
  before: {
    products: number;
    overrides: number;
  };
  after: {
    products: number;
    overrides: number;
  };
  testProductAdded: {
    id: string;
    title: string;
    price: number;
  };
  success: boolean;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData | { error: string }>) {
  try {
    // Read current data
    const before = await readAdminDataStore();
    console.log('[test-kv] Before:', { products: before.products.length, overrides: before.overrides.length });

    // Add a test product
    const testProduct = {
      id: `test-${Date.now()}`,
      title: `Test Product ${new Date().toLocaleTimeString()}`,
      image: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400',
      price: 99999,
      soldOut: false,
      createdAt: new Date().toISOString(),
    };

    const afterWrite = {
      products: [...before.products, testProduct],
      overrides: before.overrides,
    };

    console.log('[test-kv] Writing test product...');
    await writeAdminDataStore(afterWrite);
    console.log('[test-kv] Test product written successfully');

    // Read back to confirm
    const after = await readAdminDataStore();
    console.log('[test-kv] After:', { products: after.products.length, overrides: after.overrides.length });

    const success = after.products.length === afterWrite.products.length;

    res.status(200).json({
      action: 'add-test-product',
      before: {
        products: before.products.length,
        overrides: before.overrides.length,
      },
      after: {
        products: after.products.length,
        overrides: after.overrides.length,
      },
      testProductAdded: {
        id: testProduct.id,
        title: testProduct.title,
        price: testProduct.price,
      },
      success,
    });
  } catch (error) {
    res.status(500).json({
      error: `Error: ${error instanceof Error ? error.message : String(error)}`,
    });
  }
}
