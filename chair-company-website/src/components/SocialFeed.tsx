"use client";

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import ProductPreviewModal from './ProductPreviewModal';
import { fetchAdminData, getProductOverrideMapFromData } from '../lib/adminProducts';
import { getAllWebsiteEditableItems } from '../lib/siteProducts';

const WHATSAPP_NUMBER = '9779861829728';

type GalleryPost = {
  id: string;
  title: string;
  image: string;
  price: number;
};

const formatNPR = (value: number) =>
  new Intl.NumberFormat('en-NP', {
    style: 'currency',
    currency: 'NPR',
    maximumFractionDigits: 0,
  }).format(value);

const getBuyUrl = (title: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hi! I want to buy ${title}.`)}`;

export default function SocialFeed() {
  const [posts, setPosts] = useState<GalleryPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<GalleryPost | null>(null);
  const [cursor, setCursor] = useState(0);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const data = await fetchAdminData();
        const overrides = getProductOverrideMapFromData(data);
        const items = getAllWebsiteEditableItems().map((item) => ({
          id: item.id,
          title: overrides[item.id]?.title ?? item.title,
          image: overrides[item.id]?.image ?? item.image,
          price: overrides[item.id]?.price ?? item.price,
        }));

        setPosts(items);
      } catch {
        setPosts(
          getAllWebsiteEditableItems().map((item) => ({
            id: item.id,
            title: item.title,
            image: item.image,
            price: item.price,
          })),
        );
      }
    };

    void loadPosts();

    const reload = () => {
      void loadPosts();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('js-traders-data-updated', reload);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('js-traders-data-updated', reload);
      }
    };
  }, []);

  useEffect(() => {
    if (posts.length === 0) return;
    const timer = window.setInterval(() => {
      setCursor((current) => (current + 1) % posts.length);
    }, 500);

    return () => window.clearInterval(timer);
  }, [posts]);

  const visiblePosts = useMemo(() => {
    if (posts.length === 0) return [];
    const tiles = Math.min(6, posts.length);
    return Array.from({ length: tiles }, (_, index) => posts[(cursor + index) % posts.length]);
  }, [cursor, posts]);

  return (
    <section className="bg-[#F5F5F7] py-14 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-[700] tracking-tight text-[#1A1A1A] sm:text-3xl">#JSTraders</h2>
        <p className="mt-2 text-sm text-black/65">Share your workspace on Instagram and get featured.</p>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {visiblePosts.map((post, i) => (
            <article key={`${post.id}-${i}`} className="group relative aspect-square overflow-hidden rounded-xl border border-black/10 bg-white">
              <button
                type="button"
                className="h-full w-full"
                onClick={() => setSelectedPost(post)}
                aria-label={`Preview ${post.title}`}
              >
                <Image src={post.image} alt={post.title} fill className="object-cover transition duration-300 group-hover:scale-105" sizes="(max-width: 1024px) 33vw, 16vw" loading="lazy" />
              </button>

              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent opacity-0 transition duration-200 group-hover:opacity-100">
                <div className="pointer-events-auto absolute inset-x-2 bottom-2">
                  <p className="truncate text-xs font-semibold text-white">{post.title}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <a
                      href={getBuyUrl(post.title)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex h-8 items-center rounded-md bg-[#0F766E] px-2 text-[11px] font-semibold text-white"
                      onClick={(event) => event.stopPropagation()}
                    >
                      Buy Now
                    </a>
                    <button
                      type="button"
                      className="inline-flex h-8 items-center rounded-md border border-white/40 bg-white/10 px-2 text-[11px] font-semibold text-white"
                      onClick={() => setSelectedPost(post)}
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {selectedPost && (
          <ProductPreviewModal
            isOpen={Boolean(selectedPost)}
            title={selectedPost.title}
            image={selectedPost.image}
            priceLabel={formatNPR(selectedPost.price)}
            onClose={() => setSelectedPost(null)}
            buyUrl={getBuyUrl(selectedPost.title)}
          />
        )}
      </div>
    </section>
  );
}
