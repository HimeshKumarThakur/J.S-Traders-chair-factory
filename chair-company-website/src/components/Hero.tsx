"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { fetchAdminData, getProductOverrideMapFromData } from '../lib/adminProducts';
import { getAllWebsiteEditableItems, getTopPickProducts } from '../lib/siteProducts';

const Hero: React.FC = () => {
  const featuredProduct = getTopPickProducts()[0];
  const [featuredImage, setFeaturedImage] = useState(featuredProduct.imagePrimary);
  const [galleryImages, setGalleryImages] = useState<string[]>([featuredProduct.imagePrimary]);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);

  const defaultGalleryImages = useMemo(
    () => Array.from(new Set(getAllWebsiteEditableItems().map((item) => item.image))).filter(Boolean),
    [],
  );

  useEffect(() => {
    const loadFeatured = async () => {
      try {
        const data = await fetchAdminData();
        const overrides = getProductOverrideMapFromData(data);
        const override = overrides[featuredProduct.id];
        const resolvedFeaturedImage = override?.image ?? featuredProduct.imagePrimary;
        const resolvedGallery = Array.from(
          new Set(
            getAllWebsiteEditableItems().map((item) => overrides[item.id]?.image ?? item.image),
          ),
        ).filter(Boolean);

        setFeaturedImage(resolvedFeaturedImage);
        setGalleryImages(resolvedGallery.length > 0 ? resolvedGallery : defaultGalleryImages);
      } catch {
        setFeaturedImage(featuredProduct.imagePrimary);
        setGalleryImages(defaultGalleryImages.length > 0 ? defaultGalleryImages : [featuredProduct.imagePrimary]);
      }
    };

    void loadFeatured();

    const reload = () => {
      void loadFeatured();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('js-traders-data-updated', reload);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('js-traders-data-updated', reload);
      }
    };
  }, [defaultGalleryImages, featuredProduct.id, featuredProduct.imagePrimary]);

  useEffect(() => {
    setActiveGalleryIndex(0);
  }, [galleryImages.length]);

  useEffect(() => {
    if (galleryImages.length === 0) return;

    const timer = window.setInterval(() => {
      setActiveGalleryIndex((current) => (current + 1) % galleryImages.length);
    }, 3200);

    return () => window.clearInterval(timer);
  }, [galleryImages]);

  const rotatingImage = galleryImages[activeGalleryIndex] ?? featuredImage;

  return (
    <section className="relative overflow-hidden bg-[#F5F5F7]">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-16 sm:px-6 md:py-20 lg:grid-cols-2 lg:gap-12 lg:px-8">
        <motion.div
          className="flex flex-col justify-center"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <motion.p
            className="mb-4 inline-flex w-fit items-center rounded-full border border-black/10 bg-white/70 px-3 py-1 text-xs font-medium tracking-wide text-[#1A1A1A] backdrop-blur"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, delay: 0.1 }}
          >
            Luxury Ergonomic Collection · 2026
          </motion.p>

          <h1 className="text-4xl font-[700] leading-tight tracking-tight text-[#1A1A1A] sm:text-5xl lg:text-6xl">
            Ergonomics for
            <span className="block text-[#0F766E]">the Elite</span>
          </h1>

          <p className="mt-5 max-w-xl text-base font-[400] leading-relaxed text-black/70 sm:text-lg">
            Precision-crafted chairs that balance posture science, luxury materials, and executive-level aesthetics.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/products"
              className="inline-flex h-11 min-h-[44px] items-center justify-center rounded-xl bg-[#0F766E] px-6 text-sm font-semibold text-white transition hover:brightness-110"
            >
              Shop Collection
            </Link>
            <Link
              href="/contact"
              className="inline-flex h-11 min-h-[44px] items-center justify-center rounded-xl border border-black/15 bg-white px-6 text-sm font-semibold text-[#1A1A1A] transition hover:bg-black/[0.03]"
            >
              Book Showroom Visit
            </Link>
          </div>

          <div className="mt-6 flex items-center gap-4 text-sm text-black/65">
            <span>⭐ 4.8/5 from verified buyers</span>
            <span className="h-1 w-1 rounded-full bg-black/30" />
            <span>Fast Kathmandu Valley delivery</span>
          </div>
        </motion.div>

        <motion.div
          className="relative flex items-center justify-center"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut', delay: 0.1 }}
        >
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_30%,rgba(15,118,110,0.16),transparent_60%)]" />
          <Link href={`/products?previewId=${featuredProduct.id}#buy-now-section`} className="block">
            <motion.div
              className="relative w-full max-w-[560px] rounded-3xl border border-white/60 bg-white/40 p-4 shadow-[0_30px_80px_rgba(0,0,0,0.15)] backdrop-blur-xl"
              whileHover={{ y: -6 }}
              transition={{ type: 'spring', stiffness: 220, damping: 22 }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={rotatingImage}
                  initial={{ opacity: 0.35, scale: 1.015 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0.35, scale: 0.99 }}
                  transition={{ duration: 0.9, ease: 'easeInOut' }}
                >
                  <Image
                    src={rotatingImage}
                    alt="Luxury ergonomic executive chair"
                    width={1200}
                    height={1200}
                    priority
                    className="h-auto w-full rounded-2xl object-cover drop-shadow-[0_24px_40px_rgba(0,0,0,0.22)] transition duration-500 motion-safe:hover:scale-[1.02]"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;