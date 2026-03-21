"use client";

import Head from 'next/head';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import {
  AdminProduct,
  addAdminProduct,
  DEFAULT_ADMIN_ID,
  DEFAULT_ADMIN_PASSWORD,
  fetchAdminData,
  getProductOverrideMapFromData,
  getProductsFromData,
  isAdminLoggedIn,
  removeProductOverride,
  removeAdminProduct,
  setAdminSession,
  updateAdminProduct,
  upsertProductOverride,
} from '../lib/adminProducts';
import { getAllWebsiteEditableItems } from '../lib/siteProducts';

const formatNPR = (value: number) =>
  new Intl.NumberFormat('en-NP', {
    style: 'currency',
    currency: 'NPR',
    maximumFractionDigits: 0,
  }).format(value);

const readFileAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ''));
    reader.onerror = () => reject(new Error('Failed to read image file.'));
    reader.readAsDataURL(file);
  });

const compressImageDataUrl = (sourceDataUrl: string, maxWidth = 1280, quality = 0.78) =>
  new Promise<string>((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      try {
        const scale = image.width > maxWidth ? maxWidth / image.width : 1;
        const targetWidth = Math.max(1, Math.round(image.width * scale));
        const targetHeight = Math.max(1, Math.round(image.height * scale));

        const canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not process image.'));
          return;
        }

        ctx.drawImage(image, 0, 0, targetWidth, targetHeight);
        resolve(canvas.toDataURL('image/jpeg', quality));
      } catch {
        reject(new Error('Could not compress image.'));
      }
    };
    image.onerror = () => reject(new Error('Could not load image for compression.'));
    image.src = sourceDataUrl;
  });

const AdminPage = () => {
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageUploadData, setImageUploadData] = useState('');
  const [price, setPrice] = useState('');
  const [soldOut, setSoldOut] = useState(false);
  const [editingCustomId, setEditingCustomId] = useState<string | null>(null);
  const [products, setProducts] = useState<AdminProduct[]>([]);

  const [overrideMap, setOverrideMap] = useState<Record<string, { title: string; image: string; price: number; soldOut: boolean }>>({});
  const [websiteSearch, setWebsiteSearch] = useState('');
  const [editingWebsiteId, setEditingWebsiteId] = useState<string | null>(null);
  const [editingWebsiteTitle, setEditingWebsiteTitle] = useState('');
  const [editingWebsitePrice, setEditingWebsitePrice] = useState('');
  const [editingWebsiteImageUrl, setEditingWebsiteImageUrl] = useState('');
  const [editingWebsiteImageUploadData, setEditingWebsiteImageUploadData] = useState('');
  const [editingWebsiteSoldOut, setEditingWebsiteSoldOut] = useState(false);

  useEffect(() => {
    const syncData = async () => {
      try {
        const data = await fetchAdminData();
        setProducts(getProductsFromData(data));
        setOverrideMap(getProductOverrideMapFromData(data));
      } catch {
        setProducts([]);
        setOverrideMap({});
      }
    };

    setIsLoggedIn(isAdminLoggedIn());
    void syncData();
  }, []);

  const websiteItems = useMemo(() => getAllWebsiteEditableItems(), []);

  const resolvedWebsiteItems = useMemo(
    () =>
      websiteItems.map((item) => {
        const override = overrideMap[item.id];
        return {
          ...item,
          title: override?.title ?? item.title,
          image: override?.image ?? item.image,
          price: override?.price ?? item.price,
          soldOut: override?.soldOut ?? false,
          hasOverride: Boolean(override),
        };
      }),
    [websiteItems, overrideMap],
  );

  const filteredWebsiteItems = useMemo(() => {
    const q = websiteSearch.trim().toLowerCase();
    if (!q) return resolvedWebsiteItems;
    return resolvedWebsiteItems.filter((item) => item.title.toLowerCase().includes(q) || item.id.toLowerCase().includes(q));
  }, [resolvedWebsiteItems, websiteSearch]);

  const sortedProducts = useMemo(
    () => [...products].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)),
    [products],
  );

  const handleLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (adminId.trim() === DEFAULT_ADMIN_ID && password === DEFAULT_ADMIN_PASSWORD) {
      setAdminSession(true);
      setIsLoggedIn(true);
      setError('');
      setSuccess('Logged in successfully.');
      return;
    }

    setError('Invalid admin ID or password.');
  };

  const handleLogout = () => {
    setAdminSession(false);
    setIsLoggedIn(false);
    setAdminId('');
    setPassword('');
    setError('');
    setSuccess('');
  };

  const handleAddProduct = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const parsedPrice = Number(price);
    const resolvedImage = imageUploadData || imageUrl.trim();

    if (!title.trim() || !resolvedImage || !Number.isFinite(parsedPrice) || parsedPrice <= 0) {
      setError('Enter a valid product title, image (URL or upload), and price.');
      return;
    }

    try {
      let data;
      if (editingCustomId) {
        data = await updateAdminProduct(editingCustomId, {
          title: title.trim(),
          image: resolvedImage,
          price: parsedPrice,
          soldOut,
        });
      } else {
        data = await addAdminProduct({
          title: title.trim(),
          image: resolvedImage,
          price: parsedPrice,
          soldOut,
        });
      }

      setProducts(getProductsFromData(data));
      setOverrideMap(getProductOverrideMapFromData(data));
    } catch (saveError) {
      const message = saveError instanceof Error ? saveError.message : 'Failed to save product.';
      setError(message);
      return;
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('js-traders-data-updated'));
    }

    setTitle('');
    setImageUrl('');
    setImageUploadData('');
    setPrice('');
    setSoldOut(false);
    setEditingCustomId(null);
    setError('');
    setSuccess(editingCustomId ? 'Custom product updated.' : 'Custom product saved.');
  };

  const saveWebsiteOverride = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingWebsiteId) return;

    const parsedPrice = Number(editingWebsitePrice);
    const resolvedImage = editingWebsiteImageUploadData || editingWebsiteImageUrl.trim();

    if (!editingWebsiteTitle.trim() || !resolvedImage || !Number.isFinite(parsedPrice) || parsedPrice <= 0) {
      setError('Enter a valid website product title, image (URL or upload), and price.');
      return;
    }

    try {
      const data = await upsertProductOverride({
        id: editingWebsiteId,
        title: editingWebsiteTitle.trim(),
        image: resolvedImage,
        price: parsedPrice,
        soldOut: editingWebsiteSoldOut,
      });

      setProducts(getProductsFromData(data));
      setOverrideMap(getProductOverrideMapFromData(data));
    } catch (saveError) {
      const message = saveError instanceof Error ? saveError.message : 'Failed to save website edit.';
      setError(message);
      return;
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('js-traders-data-updated'));
    }

    setEditingWebsiteId(null);
    setEditingWebsiteTitle('');
    setEditingWebsiteImageUrl('');
    setEditingWebsiteImageUploadData('');
    setEditingWebsitePrice('');
    setEditingWebsiteSoldOut(false);
    setError('');
    setSuccess('Website product updated successfully.');
  };

  return (
    <>
      <Head>
        <title>Admin Panel | J.S Traders</title>
        <meta name="description" content="Admin panel for adding product images and prices." />
      </Head>

      <section className="min-h-screen bg-[#F5F5F7] py-10 sm:py-14">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[#0F766E]">Secure Access</p>
                <h1 className="mt-2 text-3xl font-[700] tracking-tight text-[#1A1A1A]">Admin Panel</h1>
              </div>

              {isLoggedIn && (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex h-11 min-h-[44px] items-center rounded-xl border border-black/15 px-4 text-sm font-semibold text-[#1A1A1A]"
                >
                  Logout
                </button>
              )}
            </div>

            {!isLoggedIn ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-[#1A1A1A]">Admin ID</span>
                  <input
                    type="text"
                    value={adminId}
                    onChange={(e) => setAdminId(e.target.value)}
                    className="h-11 min-h-[44px] w-full rounded-xl border border-black/15 px-3"
                    placeholder="Enter admin ID"
                    required
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-[#1A1A1A]">Password</span>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11 min-h-[44px] w-full rounded-xl border border-black/15 px-3"
                    placeholder="Enter password"
                    required
                  />
                </label>

                {error && <p className="text-sm font-medium text-rose-600">{error}</p>}
                {success && <p className="text-sm font-medium text-emerald-700">{success}</p>}

                <button
                  type="submit"
                  className="inline-flex h-11 min-h-[44px] items-center rounded-xl bg-[#0F766E] px-5 text-sm font-semibold text-white"
                >
                  Login
                </button>
              </form>
            ) : (
              <div className="space-y-8">
                <form onSubmit={handleAddProduct} className="space-y-4 rounded-2xl border border-black/10 bg-[#F5F5F7] p-4 sm:p-5">
                  <h2 className="text-lg font-[700] text-[#1A1A1A]">{editingCustomId ? 'Edit Custom Product' : 'Add Custom Product'}</h2>

                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-[#1A1A1A]">Product Name</span>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="h-11 min-h-[44px] w-full rounded-xl border border-black/15 px-3"
                      placeholder="Example: Premium Mesh Chair"
                      required
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-[#1A1A1A]">Product Image URL</span>
                    <input
                      type="url"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="h-11 min-h-[44px] w-full rounded-xl border border-black/15 px-3"
                      placeholder="https://example.com/product.jpg"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-[#1A1A1A]">Or Upload From Device</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="block w-full text-sm"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        try {
                          if (file.size > 8 * 1024 * 1024) {
                            setError('Image is too large. Please choose an image below 8MB.');
                            return;
                          }
                          const source = await readFileAsDataUrl(file);
                          const data = await compressImageDataUrl(source);
                          setImageUploadData(data);
                          setError('');
                        } catch {
                          setError('Could not read uploaded image.');
                        }
                      }}
                    />
                  </label>

                  {(imageUploadData || imageUrl) && (
                    <div className="overflow-hidden rounded-xl border border-black/10 bg-white p-2">
                      <img src={imageUploadData || imageUrl} alt="Preview" className="h-40 w-full rounded-lg object-cover" />
                    </div>
                  )}

                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-[#1A1A1A]">Price (NPR)</span>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="h-11 min-h-[44px] w-full rounded-xl border border-black/15 px-3"
                      min="1"
                      step="1"
                      placeholder="15000"
                      required
                    />
                  </label>

                  <label className="inline-flex items-center gap-2 rounded-lg border border-black/10 bg-white px-3 py-2 text-sm font-semibold text-[#1A1A1A]">
                    <input type="checkbox" checked={soldOut} onChange={(e) => setSoldOut(e.target.checked)} />
                    Mark as Sold Out
                  </label>

                  {error && <p className="text-sm font-medium text-rose-600">{error}</p>}

                  <button
                    type="submit"
                    className="inline-flex h-11 min-h-[44px] items-center rounded-xl bg-[#0F766E] px-5 text-sm font-semibold text-white"
                  >
                    {editingCustomId ? 'Update Product' : 'Save Product'}
                  </button>
                  {editingCustomId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingCustomId(null);
                        setTitle('');
                        setImageUrl('');
                        setImageUploadData('');
                        setPrice('');
                        setSoldOut(false);
                        setError('');
                      }}
                      className="ml-3 inline-flex h-11 min-h-[44px] items-center rounded-xl border border-black/15 px-5 text-sm font-semibold text-[#1A1A1A]"
                    >
                      Cancel Edit
                    </button>
                  )}
                </form>

                <div>
                  <h2 className="text-lg font-[700] text-[#1A1A1A]">Saved Products ({sortedProducts.length})</h2>

                  {sortedProducts.length === 0 ? (
                    <p className="mt-2 text-sm text-black/60">No custom products added yet.</p>
                  ) : (
                    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {sortedProducts.map((item) => (
                        <article key={item.id} className="overflow-hidden rounded-2xl border border-black/10 bg-[#F5F5F7] p-3">
                          <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-white">
                            <img src={item.image} alt={item.title} className="h-full w-full object-cover" loading="lazy" />
                          </div>
                          <div className="pt-3">
                            <h3 className="text-sm font-[700] text-[#1A1A1A]">{item.title}</h3>
                            <p className="mt-1 text-sm font-semibold text-[#AD7A00]">{formatNPR(item.price)}</p>
                            {item.soldOut && (
                              <p className="mt-1 inline-flex rounded-full bg-rose-100 px-2 py-1 text-xs font-semibold text-rose-700">Sold Out</p>
                            )}
                            <button
                              type="button"
                              onClick={() => {
                                setEditingCustomId(item.id);
                                setTitle(item.title);
                                setImageUrl(item.image);
                                setImageUploadData('');
                                setPrice(String(item.price));
                                setSoldOut(Boolean(item.soldOut));
                                setError('');
                              }}
                              className="mt-3 mr-2 inline-flex h-10 min-h-[40px] items-center rounded-lg border border-black/15 bg-white px-3 text-xs font-semibold text-[#1A1A1A]"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={async () => {
                                try {
                                  const data = await removeAdminProduct(item.id);
                                  setProducts(getProductsFromData(data));
                                  setOverrideMap(getProductOverrideMapFromData(data));
                                  setSuccess('Custom product deleted.');
                                } catch {
                                  setError('Could not delete custom product.');
                                }
                              }}
                              className="mt-3 inline-flex h-10 min-h-[40px] items-center rounded-lg border border-rose-200 bg-white px-3 text-xs font-semibold text-rose-700"
                            >
                              Delete
                            </button>
                          </div>
                        </article>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <h2 className="text-lg font-[700] text-[#1A1A1A]">Edit Website Listed Products</h2>
                  <p className="mt-2 text-sm text-black/60">You can edit product name, image, and price for products already shown on the website.</p>
                  <div className="mt-3">
                    <input
                      type="text"
                      value={websiteSearch}
                      onChange={(e) => setWebsiteSearch(e.target.value)}
                      placeholder="Search product name or id"
                      className="h-11 min-h-[44px] w-full rounded-xl border border-black/15 px-3"
                    />
                  </div>

                  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {filteredWebsiteItems.map((item) => (
                      <article key={item.id} className="overflow-hidden rounded-2xl border border-black/10 bg-[#F5F5F7] p-3">
                        <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-white">
                          <img src={item.image} alt={item.title} className="h-full w-full object-cover" loading="lazy" />
                        </div>
                        <div className="pt-3">
                          <p className="text-xs uppercase tracking-wide text-black/45">{item.section}</p>
                          <h3 className="mt-1 text-sm font-[700] text-[#1A1A1A]">{item.title}</h3>
                          <p className="mt-1 text-sm font-semibold text-[#AD7A00]">{formatNPR(item.price)}</p>
                          {item.soldOut && (
                            <p className="mt-1 inline-flex rounded-full bg-rose-100 px-2 py-1 text-xs font-semibold text-rose-700">Sold Out</p>
                          )}
                          <div className="mt-3 flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingWebsiteId(item.id);
                                setEditingWebsiteTitle(item.title);
                                setEditingWebsitePrice(String(item.price));
                                setEditingWebsiteImageUrl(item.image);
                                setEditingWebsiteImageUploadData('');
                                setEditingWebsiteSoldOut(Boolean(item.soldOut));
                                setError('');
                                setSuccess('');
                              }}
                              className="inline-flex h-10 min-h-[40px] items-center rounded-lg border border-black/15 bg-white px-3 text-xs font-semibold text-[#1A1A1A]"
                            >
                              Edit
                            </button>
                            {item.hasOverride && (
                              <button
                                type="button"
                                onClick={async () => {
                                  try {
                                    const data = await removeProductOverride(item.id);
                                    setProducts(getProductsFromData(data));
                                    setOverrideMap(getProductOverrideMapFromData(data));
                                    if (editingWebsiteId === item.id) {
                                      setEditingWebsiteId(null);
                                      setEditingWebsiteTitle('');
                                      setEditingWebsitePrice('');
                                      setEditingWebsiteImageUrl('');
                                      setEditingWebsiteImageUploadData('');
                                      setEditingWebsiteSoldOut(false);
                                    }
                                    if (typeof window !== 'undefined') {
                                      window.dispatchEvent(new Event('js-traders-data-updated'));
                                    }
                                    setSuccess('Website product reset to default.');
                                  } catch {
                                    setError('Could not reset website product.');
                                  }
                                }}
                                className="inline-flex h-10 min-h-[40px] items-center rounded-lg border border-rose-200 bg-white px-3 text-xs font-semibold text-rose-700"
                              >
                                Reset
                              </button>
                            )}
                          </div>

                          {editingWebsiteId === item.id && (
                            <form onSubmit={saveWebsiteOverride} className="mt-4 space-y-4 rounded-xl border border-black/10 bg-white p-3">
                              <h3 className="text-sm font-[700] text-[#1A1A1A]">Edit Website Product</h3>

                              <label className="block">
                                <span className="mb-2 block text-sm font-semibold text-[#1A1A1A]">Product Name</span>
                                <input
                                  type="text"
                                  value={editingWebsiteTitle}
                                  onChange={(e) => setEditingWebsiteTitle(e.target.value)}
                                  className="h-11 min-h-[44px] w-full rounded-xl border border-black/15 px-3"
                                  required
                                />
                              </label>

                              <label className="block">
                                <span className="mb-2 block text-sm font-semibold text-[#1A1A1A]">Image URL</span>
                                <input
                                  type="url"
                                  value={editingWebsiteImageUrl}
                                  onChange={(e) => setEditingWebsiteImageUrl(e.target.value)}
                                  className="h-11 min-h-[44px] w-full rounded-xl border border-black/15 px-3"
                                />
                              </label>

                              <label className="block">
                                <span className="mb-2 block text-sm font-semibold text-[#1A1A1A]">Or Upload From Device</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="block w-full text-sm"
                                  onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;
                                    try {
                                      if (file.size > 8 * 1024 * 1024) {
                                        setError('Image is too large. Please choose an image below 8MB.');
                                        return;
                                      }
                                      const source = await readFileAsDataUrl(file);
                                      const data = await compressImageDataUrl(source);
                                      setEditingWebsiteImageUploadData(data);
                                      setError('');
                                    } catch {
                                      setError('Could not read uploaded image.');
                                    }
                                  }}
                                />
                              </label>

                              {(editingWebsiteImageUploadData || editingWebsiteImageUrl) && (
                                <div className="overflow-hidden rounded-xl border border-black/10 bg-[#F5F5F7] p-2">
                                  <img
                                    src={editingWebsiteImageUploadData || editingWebsiteImageUrl}
                                    alt="Website product preview"
                                    className="h-40 w-full rounded-lg object-cover"
                                  />
                                </div>
                              )}

                              <label className="block">
                                <span className="mb-2 block text-sm font-semibold text-[#1A1A1A]">Price (NPR)</span>
                                <input
                                  type="number"
                                  value={editingWebsitePrice}
                                  onChange={(e) => setEditingWebsitePrice(e.target.value)}
                                  className="h-11 min-h-[44px] w-full rounded-xl border border-black/15 px-3"
                                  min="1"
                                  step="1"
                                  required
                                />
                              </label>

                              <label className="inline-flex items-center gap-2 rounded-lg border border-black/10 bg-[#F5F5F7] px-3 py-2 text-sm font-semibold text-[#1A1A1A]">
                                <input
                                  type="checkbox"
                                  checked={editingWebsiteSoldOut}
                                  onChange={(e) => setEditingWebsiteSoldOut(e.target.checked)}
                                />
                                Mark as Sold Out
                              </label>

                              <div className="flex flex-wrap gap-2">
                                <button
                                  type="submit"
                                  className="inline-flex h-10 min-h-[40px] items-center rounded-lg bg-[#0F766E] px-4 text-xs font-semibold text-white"
                                >
                                  Save Website Edit
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingWebsiteId(null);
                                    setEditingWebsiteTitle('');
                                    setEditingWebsitePrice('');
                                    setEditingWebsiteImageUrl('');
                                    setEditingWebsiteImageUploadData('');
                                    setEditingWebsiteSoldOut(false);
                                    setError('');
                                  }}
                                  className="inline-flex h-10 min-h-[40px] items-center rounded-lg border border-black/15 px-4 text-xs font-semibold text-[#1A1A1A]"
                                >
                                  Cancel
                                </button>
                              </div>
                            </form>
                          )}
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default AdminPage;
