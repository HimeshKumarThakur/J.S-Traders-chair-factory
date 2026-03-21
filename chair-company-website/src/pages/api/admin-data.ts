import type { NextApiRequest, NextApiResponse } from 'next';
import { readAdminDataStore, writeAdminDataStore } from '../../lib/adminDataStore';
import type { AdminProduct, ProductOverride } from '../../types/adminData';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '8mb',
    },
  },
};

type ActionBody =
  | { type: 'addProduct'; payload: Omit<AdminProduct, 'id' | 'createdAt'> }
  | { type: 'updateProduct'; id: string; payload: Omit<AdminProduct, 'id' | 'createdAt'> }
  | { type: 'removeProduct'; id: string }
  | { type: 'upsertOverride'; payload: Omit<ProductOverride, 'updatedAt'> }
  | { type: 'removeOverride'; id: string };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      const data = await readAdminDataStore();
      res.status(200).json(data);
      return;
    }

    if (req.method !== 'POST') {
      res.setHeader('Allow', 'GET,POST');
      res.status(405).send('Method not allowed');
      return;
    }

    const body = req.body as ActionBody;
    const current = await readAdminDataStore();

    switch (body.type) {
      case 'addProduct': {
        const next: AdminProduct = {
          id: `admin-${Date.now()}`,
          title: body.payload.title,
          image: body.payload.image,
          price: body.payload.price,
          soldOut: Boolean(body.payload.soldOut),
          createdAt: new Date().toISOString(),
        };

        const updated = { ...current, products: [next, ...current.products] };
        await writeAdminDataStore(updated);
        res.status(200).json(updated);
        return;
      }

      case 'updateProduct': {
        const products = current.products.map((item) =>
          item.id === body.id
            ? {
                ...item,
                title: body.payload.title,
                image: body.payload.image,
                price: body.payload.price,
                soldOut: Boolean(body.payload.soldOut),
              }
            : item,
        );

        const updated = { ...current, products };
        await writeAdminDataStore(updated);
        res.status(200).json(updated);
        return;
      }

      case 'removeProduct': {
        const updated = { ...current, products: current.products.filter((item) => item.id !== body.id) };
        await writeAdminDataStore(updated);
        res.status(200).json(updated);
        return;
      }

      case 'upsertOverride': {
        const nextOverride: ProductOverride = {
          id: body.payload.id,
          title: body.payload.title,
          image: body.payload.image,
          price: body.payload.price,
          soldOut: Boolean(body.payload.soldOut),
          updatedAt: new Date().toISOString(),
        };

        const exists = current.overrides.some((item) => item.id === body.payload.id);
        const overrides = exists
          ? current.overrides.map((item) => (item.id === body.payload.id ? nextOverride : item))
          : [nextOverride, ...current.overrides];

        const updated = { ...current, overrides };
        await writeAdminDataStore(updated);
        res.status(200).json(updated);
        return;
      }

      case 'removeOverride': {
        const updated = { ...current, overrides: current.overrides.filter((item) => item.id !== body.id) };
        await writeAdminDataStore(updated);
        res.status(200).json(updated);
        return;
      }

      default:
        res.status(400).send('Invalid request payload');
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    res.status(500).json({ error: message });
  }
}
