
import React from 'react';

interface WelcomeScreenProps {
  onStart: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="h-full w-full bg-cover bg-center" style={{ backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.5)), url("https://lh3.googleusercontent.com/aida-public/AB6AXuB9842ODqVay-zFiWPDrl3GfIE6ks1D5q2QdD_HMqmMK0CxZbkHrzgYPprtVE1oslxsqxpx0bMptoC3NCKcZpHsV2RFmNnq8pEe1eXfAMN8YF7eVmZCMBd4gT7fjxit-AgWfJJjLlArsqfO-WfkULF4BWDxpDTTy1AwwzTAGFhaJ9VGV_0TSJ_jBPJmSBbNIw66Kc_jIj90XCGXq7aP0tVqNMluRfXb5q17olT2sMXGWAmgm2nk5F7v0grjSSTePlmWU2KKxxGHCIQJ")' }}>
        </div>
      </div>
      
      <div className="relative z-10 flex h-14 items-center justify-between px-6 pt-4">
        <div className="flex items-center gap-2 text-white">
          <span className="material-symbols-outlined text-lg">home_pin</span>
          <span className="text-sm font-medium tracking-wide">Home Bakery</span>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-md">
          <span className="material-symbols-outlined text-white">shopping_bag</span>
        </div>
      </div>

      <div className="relative z-10 flex flex-1 items-center justify-center px-6">
        <div className="w-full max-w-sm rounded-xl border border-white/30 bg-white/10 p-8 text-center backdrop-blur-xl shadow-2xl">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-inner">
            <span className="material-symbols-outlined text-primary text-5xl">bakery_dining</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-3 font-display">The Sweet Hearth</h1>
          <p className="text-base leading-relaxed text-white/90">
            Handcrafted with love. From our oven to your home, savor the warmth of truly artisanal baking.
          </p>
          <div className="mt-6 flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-widest text-white/70">
            <span className="h-px w-8 bg-white/30"></span>
            <span>Order via WhatsApp</span>
            <span className="h-px w-8 bg-white/30"></span>
          </div>
        </div>
      </div>

      <div className="relative z-10 px-6 pb-10">
        <div className="flex flex-col gap-4">
          <button 
            onClick={onStart}
            className="flex h-16 w-full items-center justify-center gap-3 rounded-xl bg-primary px-5 text-lg font-bold text-white shadow-lg transition-transform active:scale-95 font-display"
          >
            <span className="truncate">See Menu</span>
            <span className="material-symbols-outlined text-2xl">arrow_forward</span>
          </button>
          <p className="text-center text-sm text-white/60">
            Free delivery on orders over $30
          </p>
        </div>
        <div className="h-4"></div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
