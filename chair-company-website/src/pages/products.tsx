import React from 'react';
import Head from 'next/head';
import { useMemo, useState } from 'react';


type ProductItem = {
  id: string;
  title: string;
  image: string;
  oldPrice: string;
  price: string;
};

type SubCategory = {
  name: string;
  basePrice: number;
};

const WHATSAPP_NUMBER = '9779861829728';

const chairPhotos = [
  'https://images.unsplash.com/photo-1598298881114-e3c873dc50c7?w=900&h=700&fit=crop',
  'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=900&h=700&fit=crop',
  'https://images.unsplash.com/photo-1505843513577-22bb7d21e455?w=900&h=700&fit=crop',
  'https://images.unsplash.com/photo-1565182999555-2151db350642?w=900&h=700&fit=crop',
  'https://images.unsplash.com/photo-1594738367845-36c461f0ee4d?w=900&h=700&fit=crop',
];

const furniturePhotos = [
  'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=900&h=700&fit=crop',
  'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=900&h=700&fit=crop',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&h=700&fit=crop',
  'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=900&h=700&fit=crop',
  'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=900&h=700&fit=crop',
];

const sofaPhotos = [
  'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=900&h=700&fit=crop',
  'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=900&h=700&fit=crop',
  'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=900&h=700&fit=crop',
  'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=900&h=700&fit=crop',
  'https://images.unsplash.com/photo-1493666438817-866a91353ca9?w=900&h=700&fit=crop',
];

const productImages: { [key: string]: string[] } = {
  'computer-chair': chairPhotos,
  'gaming-chair': chairPhotos,
  'conference-meeting-visitor-chair': chairPhotos,
  'bar-chair-stool': chairPhotos,
  'revolving-chair': chairPhotos,
  'cafeteria-chair': chairPhotos,
  'ergonomic-mesh-chair': chairPhotos,
  'office-chair': chairPhotos,
  'waiting-chair': chairPhotos,
  'cafeteria-furniture': furniturePhotos,
  'folding-table': furniturePhotos,
  'center-tables': furniturePhotos,
  'metal-furniture': furniturePhotos,
  'office-furniture': furniturePhotos,
  'work-station': furniturePhotos,
  'shoe-rack': furniturePhotos,
  'home-sofa': sofaPhotos,
  'office-sofa': sofaPhotos,
};

const createVarieties = (subCategory: SubCategory, categoryPrefix: string): ProductItem[] => {
  const imageKey = subCategory.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const fallbackImages = productImages[categoryPrefix === 'sofa' ? 'home-sofa' : categoryPrefix === 'furniture' ? 'office-furniture' : 'office-chair'];
  const images = productImages[imageKey] || fallbackImages;
  
  return Array.from({ length: 5 }, (_, index) => {
    const old = subCategory.basePrice + index * 1000;
    const current = old - 2000;

    return {
      id: `${categoryPrefix}-${imageKey}-${index + 1}`,
      title: `${subCategory.name} Model ${index + 1}`,
      image: images[index % images.length],
      oldPrice: `NPR ${old.toLocaleString('en-NP')}`,
      price: `NPR ${current.toLocaleString('en-NP')}`,
    };
  });
};

const chairSubcategories: SubCategory[] = [
  { name: 'Computer Chair', basePrice: 18000 },
  { name: 'Gaming Chair', basePrice: 22000 },
  { name: 'Conference/Meeting/Visitor Chair', basePrice: 17000 },
  { name: 'Bar Chair & Stool', basePrice: 14000 },
  { name: 'Revolving Chair', basePrice: 16000 },
  { name: 'Cafeteria Chair', basePrice: 15000 },
  { name: 'Ergonomic Mesh Chair', basePrice: 20000 },
  { name: 'Office Chair', basePrice: 21000 },
  { name: 'Waiting Chair', basePrice: 13000 },
];

const furnitureSubcategories: SubCategory[] = [
  { name: 'Cafeteria Furniture', basePrice: 35000 },
  { name: 'Folding Table', basePrice: 22000 },
  { name: 'Center Tables', basePrice: 26000 },
  { name: 'Metal Furniture', basePrice: 28000 },
  { name: 'Office Furniture', basePrice: 42000 },
  { name: 'Work Station', basePrice: 45000 },
  { name: 'Shoe Rack', basePrice: 12000 },
];

const sofaSubcategories: SubCategory[] = [
  { name: 'Home Sofa', basePrice: 52000 },
  { name: 'Office Sofa', basePrice: 48000 },
];

const categoryGroups = [
  {
    id: 'chair',
    title: '1. CHAIR',
    subtitle: 'Professional seating collections for every workspace need.',
    subcategories: chairSubcategories,
  },
  {
    id: 'furniture',
    title: '2. FURNITURE',
    subtitle: 'Functional and premium furniture crafted for modern interiors.',
    subcategories: furnitureSubcategories,
  },
  {
    id: 'sofa',
    title: '3. SOFA',
    subtitle: 'Comfort-first sofa options for home and office settings.',
    subcategories: sofaSubcategories,
  },
];

type MainCategory = (typeof categoryGroups)[number]['id'];

const ProductsPage = () => {
  const [activeCategory, setActiveCategory] = useState<MainCategory>('chair');
  const [activeSubCategory, setActiveSubCategory] = useState(chairSubcategories[0].name);
  const fallbackByCategory: Record<MainCategory, string> = {
    chair: chairPhotos[0],
    furniture: furniturePhotos[0],
    sofa: sofaPhotos[0],
  };

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
    () => createVarieties(selectedSubCategory, selectedCategory.id),
    [selectedSubCategory, selectedCategory.id],
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
                        const fallback = fallbackByCategory[selectedCategory.id];
                        if (target.src !== fallback) target.src = fallback;
                      }}
                    />
                  </div>

                  <div className="pt-3">
                    <h4 className="text-sm font-[700] text-[#1A1A1A]">{item.title}</h4>
                    <div className="mt-1 flex items-center gap-2 text-sm">
                      <span className="text-black/45 line-through">{item.oldPrice}</span>
                      <span className="font-[700] text-[#AD7A00]">{item.price}</span>
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
        </div>
      </section>
    </>
  );
};

export default ProductsPage;
