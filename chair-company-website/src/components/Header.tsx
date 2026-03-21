"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

const Header: React.FC = () => {
  const [open, setOpen] = useState(false);

  const navLinks = [
    { href: '/products', label: 'Products' },
    { href: '/about', label: 'About' },
    { href: '/help', label: 'Help' },
    { href: '/contact', label: 'Contact' },
    { href: '/admin', label: 'Admin' },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-black/10 bg-white/15 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div>
          <Link href="/" className="inline-flex items-center gap-3">
            <Image src="/images/js-traders-logo.svg" alt="J.S Traders" width={42} height={42} priority className="h-10 w-10" />
            <span className="text-xl font-[700] tracking-tight text-[#1A1A1A] sm:text-2xl">J.S Traders</span>
          </Link>
        </div>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-[#1A1A1A]/80 transition hover:text-[#1A1A1A]"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/products"
            className="inline-flex h-11 min-h-[44px] items-center rounded-xl bg-[#0F766E] px-5 text-sm font-semibold text-white transition hover:brightness-110"
          >
            Shop Now
          </Link>
        </nav>

        <button
          type="button"
          className="inline-flex h-11 min-h-[44px] w-11 items-center justify-center rounded-xl border border-black/15 bg-white/80 text-[#1A1A1A] md:hidden"
          aria-label="Toggle menu"
          onClick={() => setOpen((prev) => !prev)}
        >
          ☰
        </button>
      </div>

      {open && (
        <nav className="border-t border-black/10 bg-white/95 px-4 py-4 backdrop-blur md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="inline-flex h-11 min-h-[44px] items-center rounded-lg px-3 text-sm font-medium text-[#1A1A1A] hover:bg-black/[0.04]"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/products"
              className="inline-flex h-11 min-h-[44px] items-center justify-center rounded-xl bg-[#0F766E] px-5 text-sm font-semibold text-white"
              onClick={() => setOpen(false)}
            >
              Shop Now
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;