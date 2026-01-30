
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Product, CartItem } from '../types';

interface StorefrontProps {
  products: Product[];
  categories: string[];
  onProductClick: (p: Product) => void;
  onAddToCart: (p: Product) => void;
  onViewCart: () => void;
  onBack: () => void;
  cartCount: number;
  cart: CartItem[];
  updateQuantity: (id: string, delta: number) => void;
  bakeryName: string;
}

const Storefront: React.FC<StorefrontProps> = ({
  products,
  categories,
  onProductClick,
  onAddToCart,
  onViewCart,
  onBack,
  cartCount,
  cart,
  updateQuantity,
  bakeryName
}) => {
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Focus input when search is opened
  useEffect(() => {
    if (isSearching && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearching]);

  // Filter products based on active category OR search query
  const filteredProducts = useMemo(() => {
    if (isSearching && searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      return products.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
      );
    }
    return products.filter(p => p.category === activeCategory);
  }, [products, activeCategory, searchQuery, isSearching]);

  const getCartQuantity = (productId: string) => {
    return cart.filter(item => item.product.id === productId).reduce((acc, item) => acc + item.quantity, 0);
  };

  const toggleSearch = () => {
    setIsSearching(!isSearching);
    if (isSearching) {
      setSearchQuery('');
    }
  };

  return (
    <div className="relative flex flex-col min-h-screen pb-24 bg-background-light dark:bg-background-dark">
      {/* Header */}
      <div className="sticky top-0 z-20 flex items-center bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md p-4 pb-2 justify-between min-h-[64px]">
        {!isSearching ? (
          <>
            <button
              onClick={onBack}
              className="text-primary flex size-12 items-center justify-start cursor-pointer hover:opacity-70 transition-opacity"
            >
              <span className="material-symbols-outlined">arrow_back_ios</span>
            </button>
            <h2 className="text-[#181411] dark:text-white text-lg font-bold leading-tight tracking-tight flex-1 text-center font-display">{bakeryName}</h2>
            <div className="flex w-12 items-center justify-end">
              <button
                onClick={toggleSearch}
                className="text-[#181411] dark:text-white hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined">search</span>
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center w-full gap-3 animate-in fade-in slide-in-from-right-2 duration-200">
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">search</span>
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for cakes, bread..."
                className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary shadow-sm"
              />
            </div>
            <button
              onClick={toggleSearch}
              className="text-sm font-bold text-primary px-1 hover:opacity-80 transition-opacity"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Profile/Logo Section */}
      {!isSearching && (
        <div className="flex p-4 mt-2">
          <div className="flex w-full flex-col gap-4 items-center">
            <div className="p-1 rounded-full bg-accent-pink dark:bg-primary/20">
              <div
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-28 w-28 border-4 border-white dark:border-background-dark shadow-sm"
                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAN1UIeDkZWemIbGiIoeBiV4Hj8CStCaLahDAuhPQBiW6oLDO96cUJrsVra6U7nV739szaYeWy6mJeUG2azpCY8C6_ifuWhB4qjghRYXqHn4E4or2G8oudEsxfpMZilNfQnTeVHc9nhLMYeCV4n_jB0QhoUvtYahZ8vnjlnH1URGxQ4cVz35Y3icGKCd-H6kYZ4fYYSvPsh0ZygyQY3PQTTBzP4i7EWz_jfr4gqK-sfcX3TgRUAQEo7U94cHbJaDN6TOL7S2tRTrtde")' }}
              />
            </div>
            <div className="flex flex-col items-center justify-center text-center">
              <p className="text-[#181411] dark:text-white text-2xl font-bold font-display">{bakeryName}</p>
              <p className="text-[#897261] dark:text-gray-400 text-sm max-w-xs mt-1">Freshly baked with love in small batches. Homemade goodness delivered to your door.</p>
              <div className="flex items-center gap-1 mt-2 bg-green-100 dark:bg-green-900/30 px-3 py-1 rounded-full">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                <p className="text-green-700 dark:text-green-400 text-[10px] font-bold uppercase tracking-wider">Open until 6:00 PM</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Categories Tabs */}
      {!isSearching && (
        <div className="sticky top-16 z-10 bg-background-light dark:bg-background-dark py-2">
          <div className="flex border-b border-[#e6e0db] dark:border-gray-800 px-4 gap-6 overflow-x-auto no-scrollbar">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex flex-col items-center justify-center border-b-[3px] pb-3 pt-4 whitespace-nowrap transition-colors ${activeCategory === cat ? 'border-b-primary text-primary' : 'border-b-transparent text-[#897261] dark:text-gray-400'
                  }`}
              >
                <p className="text-sm font-bold">{cat}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Product List */}
      <div className="px-4">
        <h3 className="text-[#181411] dark:text-white text-lg font-bold pb-2 pt-6 font-display">
          {isSearching && searchQuery !== ''
            ? `Search results for "${searchQuery}"`
            : `${activeCategory} ${activeCategory === 'Cakes' ? 'Selection' : ''}`}
        </h3>

        {filteredProducts.length > 0 ? (
          <div className="space-y-4 mt-2">
            {filteredProducts.map(product => (
              <div
                key={product.id}
                className="flex items-center gap-4 bg-white dark:bg-gray-800/50 p-3 rounded-xl shadow-sm border border-[#e6e0db]/50 dark:border-gray-700 justify-between cursor-pointer active:scale-[0.98] transition-all group"
                onClick={() => onProductClick(product)}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="bg-center bg-no-repeat aspect-square bg-cover rounded-lg h-20 w-20 shrink-0"
                    style={{ backgroundImage: `url("${product.image}")` }}
                  />
                  <div className="flex flex-col justify-center">
                    <p className="text-[#181411] dark:text-white text-base font-bold font-display">{product.name}</p>
                    <p className="text-primary text-sm font-bold mt-1">${product.price.toFixed(2)}</p>
                    <div className="flex items-center gap-1 mt-1">
                      {getCartQuantity(product.id) > 0 ? (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded uppercase text-primary bg-primary/10">
                          {getCartQuantity(product.id)} In Cart
                        </span>
                      ) : (
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${product.status === 'In Stock'
                          ? 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30'
                          : 'text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30'
                          }`}>
                          {product.status}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="shrink-0 flex items-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onProductClick(product);
                    }}
                    className="flex size-10 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/20 hover:scale-110 active:scale-95 transition-transform"
                  >
                    <span className="material-symbols-outlined">add</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center animate-in fade-in zoom-in duration-300">
            <span className="material-symbols-outlined text-6xl text-gray-200 dark:text-gray-700 mb-4">search_off</span>
            <p className="text-[#897261] dark:text-gray-400 font-medium">No results found for "{searchQuery}"</p>
            <p className="text-xs text-gray-400 mt-1">Try searching for something else</p>
          </div>
        )}
      </div>

      {/* Bottom Padding */}
      <div className="h-8"></div>

      {/* Floating View Cart Button */}
      {cartCount > 0 && (
        <div className="fixed bottom-6 left-0 right-0 px-4 z-30 max-w-[480px] mx-auto">
          <button
            onClick={onViewCart}
            className="w-full flex items-center justify-between bg-primary hover:bg-primary/90 text-white font-bold py-4 px-6 rounded-2xl shadow-xl shadow-primary/40 transition-transform active:scale-95"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <span className="material-symbols-outlined text-[28px]">shopping_bag</span>
                <span className="absolute -top-1 -right-1 bg-white text-primary text-[10px] font-black size-4 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              </div>
              <span className="text-lg">View Cart</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-white/80 font-normal text-sm">Place on WhatsApp</span>
              <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </div>
          </button>
        </div>
      )}
    </div>
  );
};

export default Storefront;
