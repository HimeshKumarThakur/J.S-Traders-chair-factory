"use client";

import React from 'react';
import Head from 'next/head';
import { useEffect, useMemo, useState } from 'react';
import { AdminProduct, getProductOverrideMap, readAdminProducts } from '../lib/adminProducts';
import { categoryGroups, CategoryGroup, createVarieties } from '../lib/siteProducts';


type ProductItem = {
  id: string;
  title: string;
  image: string;
  oldPrice: number;
  price: number;
};

const WHATSAPP_NUMBER = '9779861829728';
type MainCategory = CategoryGroup['id'];
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=900&h=700&fit=crop';
const formatNPR = (value: number) => `NPR ${value.toLocaleString('en-NP')}`;

const ProductsPage = () => {
  const [activeCategory, setActiveCategory] = useState<MainCategory>('chair');
  const [activeSubCategory, setActiveSubCategory] = useState(categoryGroups[0].subcategories[0].name);
  const [adminProducts, setAdminProducts] = useState<AdminProduct[]>([]);
  const [overrideMap, setOverrideMap] = useState<Record<string, { title: string; image: string; price: number }>>({});

  useEffect(() => {
    const syncData = () => {
      setAdminProducts(readAdminProducts());
      setOverrideMap(getProductOverrideMap());
    };

    syncData();
    window.addEventListener('storage', syncData);
    window.addEventListener('focus', syncData);
    window.addEventListener('js-traders-data-updated', syncData);

    return () => {
      window.removeEventListener('storage', syncData);
      window.removeEventListener('focus', syncData);
      window.removeEventListener('js-traders-data-updated', syncData);
    };
  }, []);

  const selectedCategory = useMemo(
    () => categoryGroups.find((group) => group.id === activeCategory) ?? categoryGroups[0],
    [activeCategory],
  );

  const selectedSubCategory = useMemo(
    () =>
      selectedCategory.subcategories.find((subCategory) => subCategory.name === activeSubCategory) ??
      selectedCategory.subcategories[0],
    [selectedCategory, activeSubCategory],
  );

  const activeProducts = useMemo(
    () =>
      createVarieties(selectedSubCategory, selectedCategory.id).map((item): ProductItem => {
        const override = overrideMap[item.id];
        return {
          ...item,
          title: override?.title ?? item.title,
          image: override?.image ?? item.image,
          price: override?.price ?? item.price,
        };
      }),
    [selectedSubCategory, selectedCategory.id, overrideMap],
  );

  return (
    <>
      <Head>
        <title>Shop Ergonomic Chairs | J.S Traders Products</title>
        <meta
          name="description"
          content="Browse categorized chair, furniture, and sofa collections with high-quality images and direct WhatsApp ordering."
        />
      </Head>
      <section className="bg-[#F5F5F7] py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-black/10 bg-white p-7 shadow-sm sm:p-10">
            <p className="text-xs uppercase tracking-[0.2em] text-[#0F766E]">J.S Traders Product Collections</p>
            <h1 className="mt-3 text-3xl font-[700] tracking-tight text-[#1A1A1A] sm:text-4xl">Browse by Category</h1>

            <div className="mt-6 grid grid-cols-1 gap-2 border-b border-black/10 pb-3 sm:grid-cols-3">
              {categoryGroups.map((group) => (
                <button
                  key={group.id}
                  type="button"
                  onClick={() => {
                    setActiveCategory(group.id as MainCategory);
                    setActiveSubCategory(group.subcategories[0].name);
                  }}
                  className={`inline-flex h-11 min-h-[44px] items-center justify-center rounded-xl px-4 text-sm font-semibold transition ${
                    activeCategory === group.id ? 'bg-[#0F766E] text-white' : 'border border-black/15 bg-[#F5F5F7] text-[#1A1A1A]'
                  }`}
                >
                  {group.title}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 rounded-3xl border border-black/10 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-2xl font-[700] tracking-tight text-[#1A1A1A] sm:text-3xl">{selectedCategory.title}</h2>
            <p className="mt-2 text-sm text-black/65">{selectedCategory.subtitle}</p>

            <div className="mt-6 flex flex-wrap gap-2 border-b border-black/10 pb-3">
              {selectedCategory.subcategories.map((subCategory) => (
                <button
                  key={subCategory.name}
                  type="button"
                  onClick={() => setActiveSubCategory(subCategory.name)}
                  className={`inline-flex h-11 min-h-[44px] items-center rounded-xl px-4 text-sm font-semibold transition ${
                    activeSubCategory === subCategory.name
                      ? 'bg-[#1A1A1A] text-white'
                      : 'border border-black/15 bg-[#F5F5F7] text-[#1A1A1A]'
                  }`}
                >
                  {subCategory.name}
                </button>
              ))}
            </div>

            <h3 className="mt-5 text-lg font-[700] text-[#1A1A1A]">{selectedSubCategory.name}</h3>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {activeProducts.map((item) => (
                <article key={item.id} className="overflow-hidden rounded-2xl border border-black/10 bg-[#F5F5F7] p-3">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-white">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-cover"
                      loading="lazy"
                      onError={(event) => {
                        const target = event.currentTarget;
                        if (target.src !== FALLBACK_IMAGE) target.src = FALLBACK_IMAGE;
                      }}
                    />
                  </div>

                  <div className="pt-3">
                    <h4 className="text-sm font-[700] text-[#1A1A1A]">{item.title}</h4>
                    <div className="mt-1 flex items-center gap-2 text-sm">
                      <span className="text-black/45 line-through">{formatNPR(item.oldPrice)}</span>
                      <span className="font-[700] text-[#AD7A00]">{formatNPR(item.price)}</span>
                    </div>
                    <a
                      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                        `Hello, I want to buy ${item.title}. Please share details.`,
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 inline-flex h-11 min-h-[44px] items-center rounded-xl bg-[#0F766E] px-4 text-sm font-semibold text-white"
                    >
                      Buy Now
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {adminProducts.length > 0 && (
            <div className="mt-8 rounded-3xl border border-black/10 bg-white p-6 shadow-sm sm:p-8">
              <div>
                <h2 className="text-2xl font-[700] tracking-tight text-[#1A1A1A] sm:text-3xl">Latest Products</h2>
                <p className="mt-2 text-sm text-black/65">Recently added products.</p>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {adminProducts.map((item) => (
                  <article key={item.id} className="overflow-hidden rounded-2xl border border-black/10 bg-[#F5F5F7] p-3">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-white">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-full w-full object-cover"
                        loading="lazy"
                        onError={(event) => {
                          const target = event.currentTarget;
                          if (target.src !== FALLBACK_IMAGE) target.src = FALLBACK_IMAGE;
                        }}
                      />
                    </div>

                    <div className="pt-3">
                      <h3 className="text-sm font-[700] text-[#1A1A1A]">{item.title}</h3>
                      <p className="mt-1 text-sm font-[700] text-[#AD7A00]">NPR {item.price.toLocaleString('en-NP')}</p>
                      <a
                        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                          `Hello, I want to buy ${item.title}. Please share details.`,
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 inline-flex h-11 min-h-[44px] items-center rounded-xl bg-[#0F766E] px-4 text-sm font-semibold text-white"
                      >
                        Buy Now
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default ProductsPage;
