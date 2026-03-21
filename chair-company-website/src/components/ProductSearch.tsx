"use client";

import React from 'react';

interface ProductSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onClearSearch: () => void;
}

const ProductSearch: React.FC<ProductSearchProps> = ({ searchQuery, onSearchChange, onClearSearch }) => {
  return (
    <div className="mb-6 rounded-3xl border border-black/10 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-col gap-4">
        <div>
          <label htmlFor="product-search" className="block text-sm font-semibold text-[#1A1A1A] mb-2">
            Search Products
          </label>
          <div className="relative">
            <input
              id="product-search"
              type="text"
              placeholder="Search by product name, category, or keyword..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full h-12 px-4 pr-12 rounded-xl border border-black/15 bg-[#F5F5F7] text-[#1A1A1A] placeholder-black/40 transition focus:border-[#0F766E] focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={onClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-black/40 hover:text-black/60 transition"
                aria-label="Clear search"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
            <svg className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-black/40 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        {searchQuery && (
          <div className="text-sm text-black/60">
            <span className="font-semibold">Tip:</span> Try searching "chair", "sofa", "wood", or specific product names
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductSearch;
