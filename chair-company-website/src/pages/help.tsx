'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const HelpPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('shipping');

  const faqSections = {
    shipping: {
      title: 'Shipping & Delivery',
      icon: '🚚',
      faqs: [
        {
          question: 'What is the delivery area?',
          answer: 'We deliver across Kathmandu Valley including Kathmandu, Bhaktapur, and Lalitpur districts. Our standard delivery time is 3-5 business days.',
        },
        {
          question: 'What are the shipping charges?',
          answer: 'Shipping is FREE for orders above NPR 5,000. For orders below NPR 5,000, shipping charges are NPR 300.',
        },
        {
          question: 'Can I track my order?',
          answer: 'Yes! Once your order ships, you will receive a WhatsApp message with tracking details and estimated delivery date.',
        },
        {
          question: 'Is same-day delivery available?',
          answer: 'Same-day delivery is available for orders placed before 12 PM in Kathmandu city. Additional charges of NPR 500 apply.',
        },
      ],
    },
    payment: {
      title: 'Payment Methods',
      icon: '💳',
      faqs: [
        {
          question: 'What payment methods do you accept?',
          answer: 'We accept Cash on Delivery (COD), Bank Transfers, eSewa, Khalti, and Credit/Debit Cards. COD is available for Kathmandu Valley.',
        },
        {
          question: 'Is it safe to pay online?',
          answer: 'Yes! All online payments are processed through secured payment gateways. We never store your card details.',
        },
        {
          question: 'Can I change my payment method after ordering?',
          answer: 'Yes, you can change your payment method up to 24 hours before delivery. Contact our support via WhatsApp.',
        },
        {
          question: 'Do you charge VAT?',
          answer: 'All our product prices are exclusive of VAT. VAT will be added at checkout based on your location.',
        },
      ],
    },
    warranty: {
      title: 'Warranty & Returns',
      icon: '🛠️',
      faqs: [
        {
          question: 'What warranty do you provide?',
          answer: 'All chairs come with a 12-month mechanical warranty covering manufacturing defects. Fabric/cushion wear is not covered.',
        },
        {
          question: 'How do I claim warranty?',
          answer: 'Contact our support team via WhatsApp with your order number and photos. We will arrange inspection and repair/replacement.',
        },
        {
          question: 'What is your return policy?',
          answer: 'We accept returns within 7 days of delivery if the product is unused and in original packaging. Refund will be processed within 5 business days.',
        },
        {
          question: 'Can I return a chair if it doesn\'t fit my space?',
          answer: 'Yes! If the chair doesn\'t fit due to measurement issues, we accept returns. However, shipping charges may apply.',
        },
      ],
    },
    support: {
      title: 'Customer Support',
      icon: '💬',
      faqs: [
        {
          question: 'How can I contact customer support?',
          answer: 'You can reach us via WhatsApp at +977 986-1829728, email us at j.s.traders@gmail.com, or visit our office at J.S. Traders, Kathmandu 44600.',
        },
        {
          question: 'What are your support hours?',
          answer: 'We are available Monday to Saturday, 10 AM to 6 PM. Sunday we are closed. We respond to messages within 2 hours.',
        },
        {
          question: 'Do you provide assembly service?',
          answer: 'Yes! We offer free assembly service for orders within Kathmandu city. Our team will set up the furniture as per your preference.',
        },
        {
          question: 'Can I get a customized quote?',
          answer: 'Absolutely! For bulk orders or custom requirements, contact our sales team on WhatsApp for a personalized quote.',
        },
      ],
    },
    products: {
      title: 'Products & Categories',
      icon: '🪑',
      faqs: [
        {
          question: 'What types of chairs do you offer?',
          answer: 'We offer Computer Chairs, Gaming Chairs, Executive Chairs, Visitor Chairs, Office Chairs, Bar Stools, and more.',
        },
        {
          question: 'Are the chairs ergonomic?',
          answer: 'Yes! Most of our chairs feature ergonomic design with lumbar support, adjustable height, and breathable mesh backs.',
        },
        {
          question: 'Do you have bulk order discounts?',
          answer: 'Yes! For orders of 5+ chairs, we offer special bulk pricing. Contact our sales team for a quotation.',
        },
        {
          question: 'Can I see the product before buying?',
          answer: 'Of course! You can visit our showroom in Dillibazaar or request a virtual tour via WhatsApp.',
        },
      ],
    },
  };

  const tabs = [
    { key: 'shipping', label: 'Shipping', icon: '🚚' },
    { key: 'payment', label: 'Payment', icon: '💳' },
    { key: 'warranty', label: 'Warranty', icon: '🛠️' },
    { key: 'support', label: 'Support', icon: '💬' },
    { key: 'products', label: 'Products', icon: '🪑' },
  ];

  const currentSection = faqSections[activeTab as keyof typeof faqSections];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="border-b border-black/10 bg-[#F5F5F7] py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-[700] tracking-tight text-[#1A1A1A] sm:text-5xl">
              Help & Support
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-black/70">
              Find answers to common questions about shipping, payments, warranty, and our products.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="border-b border-black/10 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto space-x-2 py-4 sm:justify-center lg:space-x-4">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center whitespace-nowrap rounded-xl px-4 py-2 text-sm font-semibold transition ${
                  activeTab === tab.key
                    ? 'bg-[#0F766E] text-white'
                    : 'bg-[#F5F5F7] text-[#1A1A1A] hover:bg-black/10'
                }`}
              >
                <span className="mr-2 text-base">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-14">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-8 flex items-center gap-3">
              <span className="text-4xl">{currentSection.icon}</span>
              <h2 className="text-3xl font-[700] text-[#1A1A1A]">{currentSection.title}</h2>
            </div>

            <div className="space-y-4">
              {currentSection.faqs.map((faq, idx) => (
                <details
                  key={idx}
                  className="group rounded-2xl border border-black/10 bg-[#F5F5F7] p-6 transition"
                >
                  <summary className="flex cursor-pointer items-center justify-between font-[600] text-[#1A1A1A]">
                    {faq.question}
                    <span className="ml-3 text-xl transition group-open:rotate-180">+</span>
                  </summary>
                  <p className="mt-4 leading-relaxed text-black/70">{faq.answer}</p>
                </details>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-black/10 bg-[#F5F5F7] py-12">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h3 className="text-2xl font-[700] text-[#1A1A1A]">Still Have Questions?</h3>
          <p className="mt-3 text-black/70">
            Our support team is ready to help. Reach out via WhatsApp for instant assistance.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <a
              href="https://wa.me/9779861829728?text=Hi%20J.S%20Traders!%20I%20need%20help%20with%20your%20products.%20Can%20you%20assist%20me?"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 min-h-[44px] items-center rounded-xl bg-[#0F766E] px-6 text-sm font-semibold text-white transition hover:brightness-110"
            >
              💬 Chat on WhatsApp
            </a>
            <Link
              href="/contact"
              className="inline-flex h-11 min-h-[44px] items-center rounded-xl border border-black/15 bg-white px-6 text-sm font-semibold text-[#1A1A1A] transition hover:bg-black/[0.03]"
            >
              📍 Visit Office
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HelpPage;
