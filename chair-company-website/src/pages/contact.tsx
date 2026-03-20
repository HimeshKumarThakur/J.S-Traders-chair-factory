import React from 'react';
import Head from 'next/head';
import { useState } from 'react';

const Contact: React.FC = () => {
  const whatsappNumber = '+977 986-1829728';
  const contactEmail = 'j.s.traders@gmail.com';
  const whatsappLink = `https://wa.me/9779861829728?text=${encodeURIComponent(
    'Hello J.S Traders, I want details about your chairs and showroom visit.',
  )}`;
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const subject = `New inquiry from ${name}`;
    const body = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
    window.location.href = `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <>
      <Head>
        <title>Contact J.S Traders | Showroom & Orders</title>
        <meta
          name="description"
          content="Contact J.S Traders Chair Factory for showroom visits, product consultations, and bulk furniture orders."
        />
      </Head>
      <section className="bg-[#F5F5F7] py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 rounded-3xl border border-black/10 bg-white p-7 shadow-sm sm:p-10">
            <p className="text-xs uppercase tracking-[0.2em] text-[#0F766E]">Contact J.S Traders</p>
            <h1 className="mt-3 text-3xl font-[700] tracking-tight text-[#1A1A1A] sm:text-4xl">Let’s design your perfect office setup</h1>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-black/70 sm:text-base">
              Visit our showroom, request custom recommendations, or order directly through WhatsApp.
              We respond quickly for both retail and bulk inquiries.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 min-h-[44px] items-center rounded-xl bg-[#25D366] px-5 text-sm font-semibold text-white"
              >
                WhatsApp {whatsappNumber}
              </a>
              <a
                href="tel:+9779861829728"
                className="inline-flex h-11 min-h-[44px] items-center rounded-xl border border-black/15 bg-white px-5 text-sm font-semibold text-[#1A1A1A]"
              >
                Call Now
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm sm:p-7">
              <h2 className="text-xl font-[700] text-[#1A1A1A]">Send us a message</h2>
              <p className="mt-2 text-sm text-black/65">We typically respond within 15–30 minutes during business hours.</p>
              <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#1A1A1A]" htmlFor="name">
                    Name
                  </label>
                  <input
                    className="h-11 min-h-[44px] w-full rounded-xl border border-black/15 px-3 text-sm outline-none ring-[#0F766E]/30 focus:ring-2"
                    id="name"
                    type="text"
                    placeholder="Your Name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#1A1A1A]" htmlFor="email">
                    Email
                  </label>
                  <input
                    className="h-11 min-h-[44px] w-full rounded-xl border border-black/15 px-3 text-sm outline-none ring-[#0F766E]/30 focus:ring-2"
                    id="email"
                    type="email"
                    placeholder="Your Email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#1A1A1A]" htmlFor="message">
                    Message
                  </label>
                  <textarea
                    className="w-full rounded-xl border border-black/15 px-3 py-3 text-sm outline-none ring-[#0F766E]/30 focus:ring-2"
                    id="message"
                    placeholder="Tell us what product you want"
                    rows={5}
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    required
                  />
                </div>

                <button
                  className="inline-flex h-11 min-h-[44px] items-center rounded-xl bg-[#0F766E] px-5 text-sm font-semibold text-white"
                  type="submit"
                >
                  Send Message
                </button>
              </form>
            </div>

            <div className="space-y-6">
              <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm sm:p-7">
                <h2 className="text-xl font-[700] text-[#1A1A1A]">Visit us</h2>
                <p className="mt-3 text-sm text-black/70">
                  <span className="font-semibold">Address:</span> J.S. Traders, Kathmandu 44600
                </p>
                <p className="mt-1 text-sm text-black/70">
                  <span className="font-semibold">WhatsApp:</span> {whatsappNumber}
                </p>
                <p className="mt-1 text-sm text-black/70">
                  <span className="font-semibold">Email:</span> {contactEmail}
                </p>
                <p className="mt-1 text-sm text-black/70">
                  <span className="font-semibold">Facebook:</span>{' '}
                  <a
                    href="https://www.facebook.com/profile.php?id=61551489070192&sk"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#0F766E] hover:underline"
                  >
                    Visit Page
                  </a>
                </p>
                <p className="mt-1 text-sm text-black/70">
                  <span className="font-semibold">Business Hours:</span> Sun–Fri, 9:00 AM – 6:00 PM
                </p>
                <a
                  href="https://www.google.com/maps/dir/27.7116299,85.3762919/J.S.+Traders,+Kathmandu+44600/@27.7078579,85.3103034,13z/data=!3m1!4b1!4m10!4m9!1m1!4e1!1m5!1m1!1s0x39eb1940e4f926ff:0x2dddaf65fb2856a9!2m2!1d85.3259086!2d27.7023729!3e0?entry=ttu&g_ep=EgoyMDI2MDMxNy4wIKXMDSoASAFQAw%3D%3D"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex h-11 min-h-[44px] items-center rounded-xl bg-[#1A1A1A] px-4 text-sm font-semibold text-white"
                >
                  Get Directions
                </a>
              </div>

              <div className="overflow-hidden rounded-3xl border border-black/10 bg-white shadow-sm">
                <iframe
                  title="J.S Traders Location Map"
                  src="https://www.google.com/maps?q=J.S.+Traders,+Kathmandu+44600&output=embed"
                  className="h-[360px] w-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;