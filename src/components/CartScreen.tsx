
import React from 'react';
import { CartItem, FulfillmentMethod } from '../types';

interface CartScreenProps {
  cart: CartItem[];
  updateQuantity: (id: string, delta: number) => void;
  onBack: () => void;
  onCheckout: () => void;
  fulfillment: FulfillmentMethod;
  setFulfillment: (f: FulfillmentMethod) => void;
  deliveryDate: number;
  setDeliveryDate: (d: number) => void;
  deliveryTime: string;
  setDeliveryTime: (t: string) => void;
  address: string;
  setAddress: (a: string) => void;
  notes: string;
  setNotes: (n: string) => void;
  subtotal: number;
  deliveryFee: number;
  total: number;
}

const CartScreen: React.FC<CartScreenProps> = ({
  cart,
  updateQuantity,
  onBack,
  onCheckout,
  fulfillment,
  setFulfillment,
  deliveryDate,
  setDeliveryDate,
  deliveryTime,
  setDeliveryTime,
  address,
  setAddress,
  notes,
  setNotes,
  subtotal,
  deliveryFee,
  total
}) => {
  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark">
      {/* Nav */}
      <div className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md">
        <div className="flex items-center px-4 py-4 justify-between">
          <button onClick={onBack} className="flex items-center gap-1 text-primary cursor-pointer">
            <span className="material-symbols-outlined text-2xl">arrow_back_ios</span>
            <span className="font-medium">Menu</span>
          </button>
          <h2 className="text-lg font-bold flex-1 text-center pr-10 font-display">My Order</h2>
        </div>
      </div>

      <main className="flex flex-col gap-2 pb-48">
        {/* Order Items */}
        <div className="px-4 pt-2">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-[#897261] mb-2">Order Items</h3>
          <div className="bg-white dark:bg-[#2d221a] rounded-xl overflow-hidden divide-y divide-[#f4f2f0] dark:divide-[#3d2e23]">
            {cart.map((item, idx) => (
              <div key={`${item.product.id}-${idx}`} className="flex items-center gap-4 px-4 py-3 justify-between min-h-[88px]">
                <div className="flex items-center gap-4">
                  <div 
                    className="bg-center bg-no-repeat aspect-square bg-cover rounded-lg size-16"
                    style={{ backgroundImage: `url("${item.product.image}")` }}
                  />
                  <div className="flex flex-col justify-center">
                    <p className="text-base font-semibold leading-tight line-clamp-1">{item.product.name}</p>
                    {item.selectedSize && <p className="text-[10px] text-gray-500 uppercase">{item.selectedSize} {item.selectedVariant ? `· ${item.selectedVariant}` : ''}</p>}
                    <p className="text-[#897261] text-sm font-medium">${item.product.price.toFixed(2)} {item.quantity > 1 ? `(x${item.quantity})` : ''}</p>
                  </div>
                </div>
                <div className="shrink-0">
                  <div className="flex items-center gap-3 bg-background-light dark:bg-[#3d2e23] px-3 py-1.5 rounded-full">
                    <button onClick={() => updateQuantity(item.product.id, -1)} className="text-lg font-bold text-primary">-</button>
                    <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.product.id, 1)} className="text-lg font-bold text-primary">+</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button onClick={onBack} className="mt-4 flex items-center gap-2 text-primary font-bold text-sm">
            <span className="material-symbols-outlined text-[20px]">add_circle</span>
            Add more items
          </button>
        </div>

        {/* Fulfillment Options */}
        <div className="px-4 mt-6">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-[#897261] mb-2">Fulfillment</h3>
          <div className="flex gap-2 p-1 bg-white dark:bg-[#2d221a] rounded-lg">
            <button 
              onClick={() => setFulfillment('Delivery')}
              className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${fulfillment === 'Delivery' ? 'bg-primary text-white shadow-sm' : 'text-[#897261]'}`}
            >
              Delivery
            </button>
            <button 
              onClick={() => setFulfillment('Pickup')}
              className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${fulfillment === 'Pickup' ? 'bg-primary text-white shadow-sm' : 'text-[#897261]'}`}
            >
              Pickup
            </button>
          </div>
        </div>

        {/* Delivery Address - Only shows if fulfillment is Delivery */}
        {fulfillment === 'Delivery' && (
          <div className="px-4 mt-6 animate-in fade-in slide-in-from-top-2 duration-300">
            <h3 className="text-[#181411] dark:text-white text-lg font-bold mb-2 font-display">Delivery Address</h3>
            <div className="relative group">
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Unit number, street name, postal code..."
                className="w-full bg-white dark:bg-[#2d221a] border-none rounded-xl p-4 pr-12 text-sm font-medium focus:ring-1 focus:ring-primary shadow-sm h-24 transition-all resize-none"
              />
              <div className="absolute right-4 top-4 text-gray-400">
                <span className="material-symbols-outlined text-xl">location_on</span>
              </div>
            </div>
          </div>
        )}

        {/* Date Selector */}
        <div className="px-4 mt-6">
          <h3 className="text-[#181411] dark:text-white text-lg font-bold mb-2 font-display">{fulfillment} Date</h3>
          <div className="bg-white dark:bg-[#2d221a] rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="material-symbols-outlined cursor-pointer hover:text-primary transition-colors">chevron_left</span>
              <p className="text-base font-bold">November 2023</p>
              <span className="material-symbols-outlined cursor-pointer hover:text-primary transition-colors">chevron_right</span>
            </div>
            <div className="grid grid-cols-7 text-center mb-2">
              {['S','M','T','W','T','F','S'].map(d => <p key={d} className="text-[11px] font-bold text-[#897261] py-1">{d}</p>)}
            </div>
            <div className="grid grid-cols-7 gap-y-1">
              {[29,30,1,2,3,4,5,6,7,8,9,10,11,12].map(day => (
                <button 
                  key={day}
                  onClick={() => setDeliveryDate(day)}
                  className={`h-9 w-9 m-auto rounded-full flex items-center justify-center text-sm transition-all ${
                    deliveryDate === day ? 'bg-primary text-white font-bold' : (day < 6 ? 'text-gray-300' : 'font-medium')
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Time Input */}
        <div className="px-4 mt-6">
          <h3 className="text-[#181411] dark:text-white text-lg font-bold mb-2 font-display">{fulfillment} Time</h3>
          <div className="relative group">
            <input
              type="text"
              value={deliveryTime}
              onChange={(e) => setDeliveryTime(e.target.value)}
              placeholder="e.g. 10:30 AM or Afternoon"
              className="w-full bg-white dark:bg-[#2d221a] border-none rounded-xl p-4 pr-12 text-sm font-medium focus:ring-1 focus:ring-primary shadow-sm transition-all"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
              <span className="material-symbols-outlined text-xl">schedule</span>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="px-4 mt-6">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-[#897261] mb-2">Additional Notes</h3>
          <textarea 
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full bg-white dark:bg-[#2d221a] border-none rounded-xl p-4 text-sm focus:ring-1 focus:ring-primary h-24 transition-all resize-none shadow-sm" 
            placeholder="Allergies, delivery instructions, etc."
          />
        </div>
      </main>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-[#221810]/95 backdrop-blur-lg border-t border-[#f4f2f0] dark:border-[#3d2e23] p-4 pb-8 z-50 max-w-[480px] mx-auto">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-[#897261] text-sm">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[#897261] text-sm">
              <span>{fulfillment} Fee</span>
              <span>${deliveryFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-lg font-bold mt-1">
              <span>Grand Total</span>
              <span className="text-primary text-xl font-display">${total.toFixed(2)}</span>
            </div>
          </div>
          <button 
            onClick={onCheckout}
            disabled={fulfillment === 'Delivery' && !address.trim()}
            className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
              fulfillment === 'Delivery' && !address.trim() 
                ? 'bg-gray-300 cursor-not-allowed text-gray-500' 
                : 'bg-whatsapp hover:brightness-105 active:scale-[0.98] text-white shadow-lg shadow-green-500/20'
            }`}
          >
            <svg fill="currentColor" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.031 2c-5.508 0-9.987 4.479-9.987 9.987 0 1.757.463 3.472 1.341 4.977L2 22l5.191-1.361c1.45.79 3.089 1.208 4.84 1.208 5.508 0 9.987-4.479 9.987-9.987S17.539 2 12.031 2zm5.235 14.129c-.213.601-1.077 1.096-1.498 1.147-.384.047-.78.071-2.247-.521-1.873-.755-3.079-2.659-3.173-2.785-.094-.126-.761-.996-.761-1.99 0-.994.52-1.479.704-1.685.184-.206.403-.258.537-.258.134 0 .269.001.385.007.126.006.297-.048.464.356.172.418.59 1.439.641 1.542.051.103.086.223.017.359-.069.136-.103.223-.206.342-.103.119-.215.267-.307.359-.103.103-.211.215-.091.42.12.206.533.873 1.144 1.416.787.7 1.448.918 1.654 1.02.206.103.327.086.447-.052.12-.137.514-.6.651-.806.137-.206.274-.171.463-.103.189.068 1.2.566 1.405.67.206.103.344.155.395.24.052.085.052.493-.161 1.094z"></path>
            </svg>
            Review & Complete Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartScreen;
