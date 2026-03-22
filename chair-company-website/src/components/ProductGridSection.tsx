"use client";

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { fetchAdminData, getProductOverrideMapFromData } from '../lib/adminProducts';
import { getTopPickProducts } from '../lib/siteProducts';
import ProductPreviewModal from './ProductPreviewModal';

type Product = {
  id: string;
  name: string;
  price: number;
  soldOut?: boolean;
  rating: number;
  reviews: number;
  stock: number;
  material: 'Mesh' | 'Leather' | 'Fabric';
  color: 'Black' | 'Grey' | 'Brown';
  imagePrimary: string;
  imageSecondary: string;
};

const products: Product[] = getTopPickProducts();

const formatNPR = (value: number) =>
  new Intl.NumberFormat('en-NP', {
    style: 'currency',
    currency: 'NPR',
    maximumFractionDigits: 0,
  }).format(value);

const WHATSAPP_NUMBER = '9779861829728';

export default function ProductGridSection() {
  const [overrideMap, setOverrideMap] = useState<Record<string, { title: string; image: string; price: number; soldOut: boolean }>>({});
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [maxPrice, setMaxPrice] = useState(55000);
  const [material, setMaterial] = useState<'All' | Product['material']>('All');
  const [rating, setRating] = useState(4.5);
  const [color, setColor] = useState<'All' | Product['color']>('All');

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

  const resolvedProducts = useMemo(
    () =>
      products.map((product) => {
        const override = overrideMap[product.id];
        return {
          ...product,
          name: override?.title ?? product.name,
          price: override?.price ?? product.price,
          imagePrimary: override?.image ?? product.imagePrimary,
          soldOut: override?.soldOut ?? false,
        };
      }),
    [overrideMap],
  );

  const filteredProducts = useMemo(
    () =>
      resolvedProducts.filter((product) => {
        const query = searchQuery.trim().toLowerCase();
        const bySearch =
          query.length === 0
            ? true
            : product.name.toLowerCase().includes(query) ||
              product.material.toLowerCase().includes(query) ||
              product.color.toLowerCase().includes(query);
        const byPrice = product.price <= maxPrice;
        const byMaterial = material === 'All' ? true : product.material === material;
        const byRating = product.rating >= rating;
        const byColor = color === 'All' ? true : product.color === color;
        return bySearch && byPrice && byMaterial && byRating && byColor;
      }),
    [resolvedProducts, searchQuery, maxPrice, material, rating, color],
  );

  return (
    <section className="bg-white py-14 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-[700] tracking-tight text-[#1A1A1A] sm:text-3xl">Top Picks for Elite Comfort</h2>
            <p className="mt-2 text-sm text-black/65">Verified buyers, premium materials, and ergonomic engineering.</p>
          </div>

          <button
            type="button"
            className="inline-flex h-11 min-h-[44px] items-center rounded-xl border border-black/10 px-4 text-sm font-semibold text-[#1A1A1A] hover:bg-black/[0.03]"
            onClick={() => setDrawerOpen(true)}
          >
            Smart Filters
          </button>
        </div>

        <div className="mb-6">
          <label htmlFor="top-picks-search" className="mb-2 block text-sm font-semibold text-[#1A1A1A]">
            Search Products
          </label>
          <div className="relative">
            <input
              id="top-picks-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by product name, material, or color"
              className="h-11 min-h-[44px] w-full rounded-xl border border-black/15 bg-white px-4 pr-12 text-sm text-[#1A1A1A] outline-none transition focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/20"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-black/55 hover:bg-black/5"
                aria-label="Clear search"
              >
                x
              </button>
            )}
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="rounded-2xl border border-black/10 bg-[#F9FAFB] px-5 py-8 text-center">
            <p className="text-base font-semibold text-[#1A1A1A]">No products matched your search.</p>
            <p className="mt-1 text-sm text-black/60">Try a different name, material, or color.</p>
            {searchQuery && (
              <button
                type="button"
                className="mt-4 inline-flex h-11 min-h-[44px] items-center rounded-xl border border-black/15 px-4 text-sm font-semibold text-[#1A1A1A] hover:bg-black/[0.03]"
                onClick={() => setSearchQuery('')}
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filteredProducts.map((product) => (
              <motion.article
                key={product.id}
                className="group relative overflow-hidden rounded-2xl border border-black/8 bg-[#F5F5F7] p-3 transition duration-300 hover:border-white/60 hover:bg-white/40 hover:shadow-[0_20px_60px_rgba(0,0,0,0.12)] hover:backdrop-blur-xl"
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                whileHover={{ y: -4 }}
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-white">
                  <img
                    src={product.imagePrimary}
                    alt={`${product.name} primary view`}
                    className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.03] group-hover:opacity-0"
                    loading="lazy"
                    onClick={() => setSelectedProductId(product.id)}
                  />
                  <img
                    src={product.imageSecondary}
                    alt={`${product.name} angled view`}
                    className="absolute inset-0 h-full w-full object-cover opacity-0 transition duration-500 group-hover:opacity-100"
                    loading="lazy"
                    onClick={() => setSelectedProductId(product.id)}
                  />

                  <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center opacity-0 transition group-hover:opacity-100">
                    {product.soldOut ? (
                      <span className="pointer-events-auto inline-flex h-11 min-h-[44px] items-center rounded-xl bg-rose-100 px-4 text-sm font-semibold text-rose-700 shadow-lg">
                        Sold Out
                      </span>
                    ) : (
                      <motion.a
                        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                          `Hello, I want to buy ${product.name}. Please share details.`,
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="pointer-events-auto inline-flex h-11 min-h-[44px] items-center rounded-xl bg-[#0F766E] px-4 text-sm font-semibold text-white shadow-lg hover:brightness-110"
                        aria-label={`Quick buy ${product.name}`}
                        whileTap={{ scale: 0.98 }}
                      >
                        Quick Buy
                      </motion.a>
                    )}
                  </div>
                </div>

                <div className="px-1 pb-1 pt-4">
                  <h3 className="text-base font-[700] text-[#1A1A1A]">{product.name}</h3>

                  <div className="mt-1 flex items-center gap-2 text-sm text-black/65">
                    <span>⭐ {product.rating}</span>
                    <span>({product.reviews})</span>
                    <span className="h-1 w-1 rounded-full bg-black/30" />
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">Verified Purchase</span>
                  </div>

                  <div className="mt-2 flex items-center justify-between">
                    <p className="text-lg font-[700] text-[#1A1A1A]">{formatNPR(product.price)}</p>
                    {product.soldOut ? (
                      <p className="text-xs font-semibold text-rose-700">Sold Out</p>
                    ) : (
                      <p className={`text-xs font-medium ${product.stock <= 3 ? 'text-rose-600' : 'text-black/60'}`}>
                        {product.stock <= 3 ? `Only ${product.stock} left in Kathmandu` : `${product.stock} in stock`}
                      </p>
                    )}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}

        <AnimatePresence>
          {drawerOpen && (
            <motion.div
              className="fixed inset-0 z-[60] bg-black/40"
              onClick={() => setDrawerOpen(false)}
              aria-hidden="true"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {drawerOpen && (
            <motion.aside
              className="fixed right-0 top-0 z-[70] h-full w-full max-w-sm bg-white p-5 shadow-2xl"
              aria-label="Smart filters"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 280, damping: 28 }}
            >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-[700] text-[#1A1A1A]">Smart Filters</h3>
            <button
              type="button"
              className="inline-flex h-11 min-h-[44px] w-11 items-center justify-center rounded-xl border border-black/15"
              onClick={() => setDrawerOpen(false)}
            >
              ✕
            </button>
          </div>

          <div className="mt-6 space-y-6 text-sm">
            <label className="block">
              <span className="mb-2 block font-semibold text-[#1A1A1A]">Price up to {formatNPR(maxPrice)}</span>
              <input
                type="range"
                min={20000}
                max={55000}
                step={1000}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full"
              />
            </label>

            <label className="block">
              <span className="mb-2 block font-semibold text-[#1A1A1A]">Material</span>
              <select
                className="h-11 min-h-[44px] w-full rounded-xl border border-black/15 px-3"
                value={material}
                onChange={(e) => setMaterial(e.target.value as 'All' | Product['material'])}
              >
                <option value="All">All</option>
                <option value="Leather">Leather</option>
                <option value="Mesh">Mesh</option>
                <option value="Fabric">Fabric</option>
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block font-semibold text-[#1A1A1A]">Ergonomic Rating</span>
              <select
                className="h-11 min-h-[44px] w-full rounded-xl border border-black/15 px-3"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
              >
                <option value={4.5}>4.5+ stars</option>
                <option value={4.7}>4.7+ stars</option>
                <option value={4.8}>4.8+ stars</option>
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block font-semibold text-[#1A1A1A]">Color</span>
              <select
                className="h-11 min-h-[44px] w-full rounded-xl border border-black/15 px-3"
                value={color}
                onChange={(e) => setColor(e.target.value as 'All' | Product['color'])}
              >
                <option value="All">All</option>
                <option value="Black">Black</option>
                <option value="Grey">Grey</option>
                <option value="Brown">Brown</option>
              </select>
            </label>
          </div>

          <div className="absolute inset-x-5 bottom-5 flex gap-3">
            <button
              type="button"
              className="inline-flex h-11 min-h-[44px] flex-1 items-center justify-center rounded-xl border border-black/15 font-semibold text-[#1A1A1A]"
              onClick={() => {
                setMaxPrice(55000);
                setMaterial('All');
                setRating(4.5);
                setColor('All');
              }}
            >
              Clear
            </button>
            <button
              type="button"
              className="inline-flex h-11 min-h-[44px] flex-1 items-center justify-center rounded-xl bg-[#0F766E] font-semibold text-white"
              onClick={() => setDrawerOpen(false)}
            >
              Apply
            </button>
          </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {selectedProductId && (
          <ProductPreviewModal
            isOpen={Boolean(selectedProductId)}
            title={filteredProducts.find((item) => item.id === selectedProductId)?.name ?? 'Product'}
            image={filteredProducts.find((item) => item.id === selectedProductId)?.imagePrimary ?? ''}
            priceLabel={formatNPR(filteredProducts.find((item) => item.id === selectedProductId)?.price ?? 0)}
            soldOut={Boolean(filteredProducts.find((item) => item.id === selectedProductId)?.soldOut)}
            onClose={() => setSelectedProductId(null)}
            buyUrl={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
              `Hello, I want to buy ${filteredProducts.find((item) => item.id === selectedProductId)?.name ?? 'this product'}. Please share details.`,
            )}`}
          />
        )}
      </div>
    </section>
  );
}
