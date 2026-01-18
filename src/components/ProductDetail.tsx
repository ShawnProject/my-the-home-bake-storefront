
import React, { useState } from 'react';
import { Product } from '../types';

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
  onAddToCart: (p: Product, q: number, s?: string, v?: string) => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, onBack, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0]?.name);
  const [selectedVariant, setSelectedVariant] = useState(product.variants?.[0]);

  return (
    <div className="relative flex flex-col min-h-screen bg-white dark:bg-[#1c140e] pb-32">
      {/* Top Header */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center p-4 justify-between bg-gradient-to-b from-black/50 to-transparent">
        <button 
          onClick={onBack}
          className="flex size-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white"
        >
          <span className="material-symbols-outlined">arrow_back_ios_new</span>
        </button>
        <div className="flex gap-2">
          <button className="flex size-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white">
            <span className="material-symbols-outlined">share</span>
          </button>
          <button className="flex size-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white">
            <span className="material-symbols-outlined">favorite</span>
          </button>
        </div>
      </div>

      {/* Product Image */}
      <div 
        className="w-full bg-center bg-no-repeat bg-cover h-[400px]"
        style={{ backgroundImage: `url("${product.image}")` }}
      />

      {/* Info Section */}
      <div className="px-4 pt-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2 py-0.5 rounded-lg bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">Home Bakery</span>
          <div className="flex items-center text-yellow-500">
            <span className="material-symbols-outlined text-sm">star</span>
            <span className="text-xs font-bold ml-1 text-[#181411] dark:text-white">
              {product.rating} ({product.reviews} reviews)
            </span>
          </div>
        </div>
        <h1 className="text-[#181411] dark:text-white text-[28px] font-bold leading-tight font-display">{product.name}</h1>
      </div>

      {/* Price */}
      <div className="flex items-baseline px-4 pt-2">
        <h2 className="text-[#181411] dark:text-white text-[24px] font-bold leading-tight">${product.price.toFixed(2)}</h2>
        <span className="ml-2 text-sm text-gray-500 line-through">${(product.price * 1.2).toFixed(2)}</span>
      </div>

      {/* Description */}
      <div className="px-4 pt-2 pb-4">
        <p className="text-[#181411]/70 dark:text-white/70 text-base leading-relaxed">
          {product.description}
        </p>
      </div>

      {/* Size Options */}
      {product.sizes && (
        <div className="px-4 py-4">
          <h3 className="text-base font-bold mb-3">Choose Size</h3>
          <div className="flex gap-3">
            {product.sizes.map(size => (
              <button 
                key={size.name}
                onClick={() => setSelectedSize(size.name)}
                className={`flex-1 py-3 px-4 rounded-xl border-2 flex flex-col items-center transition-all ${
                  selectedSize === size.name 
                    ? 'border-primary bg-primary/5 text-primary' 
                    : 'border-gray-100 dark:border-gray-800 bg-transparent text-gray-500'
                }`}
              >
                <span className="font-bold">{size.name}</span>
                <span className="text-[10px]">Feeds {size.feeds}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Flavor Options */}
      {product.variants && (
        <div className="px-4 py-4">
          <h3 className="text-base font-bold mb-3">Flavor Variant</h3>
          <div className="flex flex-wrap gap-2">
            {product.variants.map(variant => (
              <button 
                key={variant}
                onClick={() => setSelectedVariant(variant)}
                className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${
                  selectedVariant === variant
                    ? 'border-primary bg-primary text-white'
                    : 'border-gray-200 dark:border-gray-700 text-gray-500'
                }`}
              >
                {variant}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-20 mx-auto max-w-[480px] bg-white/80 dark:bg-[#1c140e]/80 backdrop-blur-xl border-t border-gray-100 dark:border-gray-800 p-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-xl p-1 shrink-0">
            <button 
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
              className="size-10 flex items-center justify-center text-primary"
            >
              <span className="material-symbols-outlined">remove</span>
            </button>
            <span className="w-8 text-center font-bold">{quantity}</span>
            <button 
              onClick={() => setQuantity(q => q + 1)}
              className="size-10 flex items-center justify-center text-primary"
            >
              <span className="material-symbols-outlined">add</span>
            </button>
          </div>
          <button 
            onClick={() => onAddToCart(product, quantity, selectedSize, selectedVariant)}
            className="flex-1 bg-primary text-white font-bold h-12 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
          >
            <span className="material-symbols-outlined">shopping_cart</span>
            Add to Cart
          </button>
        </div>
        <button className="w-full mt-3 text-center text-sm font-medium text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1">
          <span className="material-symbols-outlined text-lg">chat</span>
          Have custom requests? Inquire via WhatsApp
        </button>
      </div>
    </div>
  );
};

export default ProductDetail;
