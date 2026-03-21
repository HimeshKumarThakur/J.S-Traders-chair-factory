"use client";

import { useEffect, useState } from 'react';
import { fetchAdminData, getProductOverrideMapFromData } from '../lib/adminProducts';
import { getBestSellerItems } from '../lib/siteProducts';
import ProductPreviewModal from './ProductPreviewModal';

const formatNPR = (value: number) => `NPR ${value.toLocaleString('en-NP')}`;

export default function BestSellers() {
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [overrideMap, setOverrideMap] = useState<Record<string, { title: string; image: string; price: number; soldOut: boolean }>>({});

  useEffect(() => {
    const syncOverrides = async () => {
      try {
        const data = await fetchAdminData();
        setOverrideMap(getProductOverrideMapFromData(data));
      } catch {
        setOverrideMap({});
      }
    };

    void syncOverrides();
    window.addEventListener('storage', syncOverrides);
    window.addEventListener('focus', syncOverrides);
    window.addEventListener('js-traders-data-updated', syncOverrides);

    return () => {
      window.removeEventListener('storage', syncOverrides);
      window.removeEventListener('focus', syncOverrides);
      window.removeEventListener('js-traders-data-updated', syncOverrides);
    };
  }, []);

  const items = getBestSellerItems().map((item) => {
    const override = overrideMap[item.id];
    const resolvedPrice = override?.price ?? item.price;
    const showRuleBasedOldPrice = override ? resolvedPrice < item.price : true;
    const oldPrice = override ? item.price : item.oldPrice;

    return {
      ...item,
      name: override?.title ?? item.name,
      image: override?.image ?? item.image,
      price: resolvedPrice,
      showRuleBasedOldPrice,
      oldPrice,
      soldOut: override?.soldOut ?? false,
    };
  });

  const selectedItem = items.find((item) => item.id === selectedItemId) ?? null;

  return (
    <section className="bg-white py-14 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-7 flex items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-[700] tracking-tight text-[#1A1A1A] sm:text-3xl">Best Sellers</h2>
            <p className="mt-2 text-sm text-black/65">Comfort-first office furniture for productive workspaces.</p>
          </div>
          <a href="/products" className="text-sm font-semibold text-[#0F766E] hover:underline">View all</a>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <article key={item.id} className="group rounded-2xl border border-black/10 bg-[#F5F5F7] p-3">
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-white">
                <button
                  type="button"
                  className="block h-full w-full"
                  onClick={() => setSelectedItemId(item.id)}
                  aria-label={`Preview ${item.name}`}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.04]"
                    loading="lazy"
                  />
                </button>
                <span className="absolute left-2 top-2 rounded-full bg-[#0F766E] px-2 py-1 text-xs font-semibold text-white">
                  {item.discount}
                </span>
                {item.soldOut && (
                  <span className="absolute right-2 top-2 rounded-full bg-rose-100 px-2 py-1 text-xs font-semibold text-rose-700">
                    Sold Out
                  </span>
                )}
              </div>
              <div className="pt-3">
                <p className="text-xs uppercase tracking-wide text-black/45">{item.category}</p>
                <h3 className="mt-1 text-sm font-[700] text-[#1A1A1A]">{item.name}</h3>
                <div className="mt-2 flex items-center gap-2 text-sm">
                  <span className="font-[700] text-[#1A1A1A]">{formatNPR(item.price)}</span>
                  {item.showRuleBasedOldPrice && (
                    <span className="text-black/45 line-through">{formatNPR(item.oldPrice)}</span>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>

        {selectedItem && (
          <ProductPreviewModal
            isOpen={Boolean(selectedItem)}
            title={selectedItem.name}
            image={selectedItem.image}
            priceLabel={formatNPR(selectedItem.price)}
            soldOut={selectedItem.soldOut}
            onClose={() => setSelectedItemId(null)}
            buyUrl={`https://wa.me/9779861829728?text=${encodeURIComponent(
              `Hello, I want to buy ${selectedItem.name}. Please share details.`,
            )}`}
          />
        )}
      </div>
    </section>
  );
}
