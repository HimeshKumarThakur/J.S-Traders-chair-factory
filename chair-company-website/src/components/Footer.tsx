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
            <span className="inline-flex items-center gap-2">
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
                <path d="M20.52 3.48A11.83 11.83 0 0 0 12.05 0C5.42 0 .03 5.39.03 12.02c0 2.12.55 4.18 1.6 6.01L0 24l6.14-1.61a11.96 11.96 0 0 0 5.88 1.5h.01c6.63 0 12.02-5.39 12.02-12.02 0-3.21-1.25-6.22-3.53-8.39ZM12.03 21.9h-.01a9.95 9.95 0 0 1-5.07-1.38l-.36-.21-3.64.95.97-3.55-.23-.37a9.9 9.9 0 0 1-1.53-5.32C2.16 6.45 6.48 2.13 12.03 2.13c2.65 0 5.14 1.03 7.01 2.9a9.83 9.83 0 0 1 2.9 6.99c0 5.55-4.32 9.88-9.91 9.88Zm5.44-7.41c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.66.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.65.07-.3-.15-1.28-.47-2.44-1.49-.9-.8-1.5-1.8-1.68-2.1-.17-.3-.02-.47.13-.62.14-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.66-1.6-.9-2.19-.24-.58-.49-.5-.66-.5h-.57c-.2 0-.52.08-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.22 3.08.15.2 2.1 3.2 5.1 4.49.71.31 1.26.49 1.69.63.71.23 1.35.2 1.86.12.57-.08 1.75-.71 2-1.39.25-.69.25-1.27.17-1.39-.07-.12-.27-.2-.56-.34Z" />
              </svg>
              WhatsApp: +977 986-1829728
            </span>
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
            <span className="inline-flex items-center gap-2">
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
                <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.85c0-2.5 1.49-3.88 3.77-3.88 1.09 0 2.23.19 2.23.19v2.46h-1.26c-1.25 0-1.64.77-1.64 1.56V12h2.79l-.45 2.89h-2.34v6.99A10 10 0 0 0 22 12Z" />
              </svg>
              Facebook: J.S Traders
            </span>
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