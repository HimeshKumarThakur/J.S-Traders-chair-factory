import React from 'react';

const WHATSAPP_NUMBER = '9779861829728';

interface ProductCardProps {
  image?: string;
  title?: string;
  description?: string;
  price?: string;
  product?: {
    image: string;
    title: string;
    description: string;
    price?: string;
  };
}

const ProductCard: React.FC<ProductCardProps> = ({ image, title, description, price, product }) => {
  const resolvedImage = product?.image ?? image ?? '';
  const resolvedTitle = product?.title ?? title ?? 'Product';
  const resolvedDescription = product?.description ?? description ?? '';
  const resolvedPrice = product?.price ?? price;

  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg transition-transform transform hover:scale-105">
      <img className="w-full" src={resolvedImage} alt={resolvedTitle} />
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{resolvedTitle}</div>
        <p className="text-gray-700 text-base">{resolvedDescription}</p>
      </div>
      {resolvedPrice && (
        <div className="px-6 pt-4 pb-2">
          <span className="text-gray-900 font-bold text-lg">{resolvedPrice}</span>
        </div>
      )}
      <div className="px-6 pb-5">
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
            `Hello, I want to buy ${resolvedTitle}. Please share full details.`,
          )}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-11 min-h-[44px] items-center justify-center rounded-xl bg-[#0F766E] px-5 text-sm font-semibold text-white"
        >
          Buy Now
        </a>
      </div>
    </div>
  );
};

export default ProductCard;