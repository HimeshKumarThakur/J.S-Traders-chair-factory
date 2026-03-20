import React from 'react';

const WHATSAPP_NUMBER = '9779861829728';

export default function WhatsAppFloat() {
  const message = encodeURIComponent('Hello J.S Traders, I want to inquire about your chairs.');

  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-[90] inline-flex h-14 min-h-[44px] items-center justify-center rounded-full bg-[#25D366] px-5 text-sm font-bold text-white shadow-[0_12px_30px_rgba(37,211,102,0.35)] transition hover:brightness-110"
    >
      WhatsApp
    </a>
  );
}
