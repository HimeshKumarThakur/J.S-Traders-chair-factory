import React from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-black/10 bg-[#1A1A1A] py-10 text-white">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-5 px-4 text-center sm:px-6 md:grid-cols-2 md:text-left lg:px-8">
        <div>
          <p className="text-sm text-white/70">&copy; {new Date().getFullYear()} J.S Traders Chair Factory. All rights reserved.</p>
          <a
            href="https://www.google.com/maps/dir/27.7116299,85.3762919/J.S.+Traders,+Kathmandu+44600/@27.7078579,85.3103034,13z/data=!3m1!4b1!4m10!4m9!1m1!4e1!1m5!1m1!1s0x39eb1940e4f926ff:0x2dddaf65fb2856a9!2m2!1d85.3259086!2d27.7023729!3e0?entry=ttu&g_ep=EgoyMDI2MDMxNy4wIKXMDSoASAFQAw%3D%3D"
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-block text-sm text-white/70 hover:text-white"
          >
            J.S. Traders, Kathmandu
          </a>
          <a href="https://wa.me/9779861829728" target="_blank" rel="noreferrer" className="mt-1 block text-sm text-white/80 hover:text-white">
            WhatsApp: +977 986-1829728
          </a>
          <a href="mailto:j.s.traders@gmail.com" className="mt-1 block text-sm text-white/80 hover:text-white">
            Email: j.s.traders@gmail.com
          </a>
          <a
            href="https://www.facebook.com/profile.php?id=61551489070192&sk"
            target="_blank"
            rel="noreferrer"
            className="mt-1 block text-sm text-white/80 hover:text-white"
          >
            Facebook: J.S Traders
          </a>
        </div>
        <div className="flex items-center justify-center gap-4 text-sm text-white/70 md:justify-end">
          <Link href="/about" className="hover:text-white">About</Link>
          <Link href="/products" className="hover:text-white">Products</Link>
          <Link href="/contact" className="hover:text-white">Contact</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;