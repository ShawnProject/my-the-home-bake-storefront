
import React, { useState, useEffect } from 'react';
import { CartItem } from '../types';
import { jsPDF } from 'jspdf';
import { WHATSAPP_NUMBER } from '../constants';
import { createOrder } from '../api';

interface OrderSummaryProps {
  cart: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  fulfillment: string;
  deliveryDate: number;
  deliveryTime: string;
  address: string;
  notes: string;
  onBack: () => void;
  onComplete: () => void;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  cart, subtotal, deliveryFee, total, fulfillment, deliveryDate, deliveryTime, address, notes, onBack, onComplete
}) => {
  const [progress, setProgress] = useState(0);
  const [orderId] = useState(`HB-${Math.floor(Math.random() * 90000) + 10000}`);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 10;
      });
    }, 150);
    return () => clearInterval(timer);
  }, []);

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const margin = 20;
    let y = 30;

    // Brand Header
    doc.setFontSize(22);
    doc.setTextColor(238, 124, 43); // Primary Color (#ee7c2b)
    doc.text("THE HOME BAKE", margin, y);

    y += 10;
    doc.setFontSize(10);
    doc.setTextColor(137, 114, 97); // Dark brown-ish
    doc.text(`Order Summary - ${orderId}`, margin, y);

    y += 15;
    doc.setDrawColor(230, 224, 219);
    doc.line(margin, y, 190, y);

    // Order Context
    y += 15;
    doc.setFontSize(12);
    doc.setTextColor(24, 20, 17);
    doc.setFont("helvetica", "bold");
    doc.text("FULFILLMENT DETAILS", margin, y);

    y += 10;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Method: ${fulfillment}`, margin, y);
    doc.text(`Scheduled Date: Nov ${deliveryDate}, 2023`, margin + 60, y);
    doc.text(`Preferred Time: ${deliveryTime}`, margin + 120, y);

    if (fulfillment === 'Delivery' && address) {
      y += 8;
      doc.setFont("helvetica", "bold");
      doc.text("Delivery Address:", margin, y);
      y += 5;
      doc.setFont("helvetica", "normal");
      const splitAddress = doc.splitTextToSize(address, 160);
      doc.text(splitAddress, margin, y);
      y += (splitAddress.length * 5);
    }

    if (notes) {
      y += 10;
      doc.setFont("helvetica", "italic");
      doc.text(`Special Notes: ${notes}`, margin, y);
      y += 5;
    }

    y += 15;
    doc.setDrawColor(230, 224, 219);
    doc.line(margin, y, 190, y);

    // Items Section
    y += 15;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("ITEMS", margin, y);
    doc.text("PRICE", 170, y);

    y += 10;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);

    cart.forEach(item => {
      if (y > 270) {
        doc.addPage();
        y = 30;
      }

      doc.text(`${item.quantity}x ${item.product.name}`, margin, y);
      doc.text(`$${(item.product.price * item.quantity).toFixed(2)}`, 170, y);
      y += 6;
      if (item.selectedSize) {
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(`${item.selectedSize} ${item.selectedVariant ? `· ${item.selectedVariant}` : ''}`, margin, y);
        doc.setFontSize(10);
        doc.setTextColor(24, 20, 17);
        y += 6;
      }
    });

    // Totals Section
    y += 10;
    doc.line(margin, y, 190, y);

    y += 10;
    doc.text("Subtotal:", 130, y);
    doc.text(`$${subtotal.toFixed(2)}`, 170, y);

    y += 6;
    doc.text(`${fulfillment} Fee:`, 130, y);
    doc.text(`$${deliveryFee.toFixed(2)}`, 170, y);

    y += 10;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("GRAND TOTAL:", 130, y);
    doc.text(`$${total.toFixed(2)}`, 170, y);

    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(150, 150, 150);
    doc.text("Thank you for choosing The Home Bake!", 105, 280, { align: "center" });

    doc.save(`The-Home-Bake-Order-${orderId}.pdf`);
  };



  const handleWhatsAppOrder = async () => {
    // 0. Save order to Supabase
    try {
      await createOrder({
        items: cart,
        total_amount: total,
        delivery_fee: deliveryFee,
        fulfillment_method: fulfillment as any, // Cast if necessary, or fix types
        delivery_date: deliveryDate.toString(),
        delivery_time: deliveryTime,
        address: address,
        notes: notes
      });
    } catch (error) {
      console.error("Failed to save order", error);
      alert("There was an error saving your order, but we will proceed to WhatsApp.");
    }

    // 1. Trigger PDF Download
    handleDownloadPDF();

    // 2. Format Message
    const itemLines = cart.map(item =>
      `- ${item.quantity}x ${item.product.name}${item.selectedSize ? ` (${item.selectedSize}${item.selectedVariant ? `, ${item.selectedVariant}` : ''})` : ''}: $${(item.product.price * item.quantity).toFixed(2)}`
    ).join('\n');

    const message = `*NEW ORDER FROM THE HOME BAKE* 🧁\n` +
      `--------------------------------\n` +
      `*Order ID:* #${orderId}\n\n` +
      `*Items:*\n${itemLines}\n\n` +
      `*Fulfillment:* ${fulfillment}\n` +
      `*Date:* Nov ${deliveryDate}, 2023\n` +
      `*Time:* ${deliveryTime}\n` +
      (fulfillment === 'Delivery' && address ? `*Address:* ${address}\n` : '') +
      (notes ? `\n*Notes:* ${notes}\n` : '') +
      `\n--------------------------------\n` +
      `*Subtotal:* $${subtotal.toFixed(2)}\n` +
      `*${fulfillment} Fee:* $${deliveryFee.toFixed(2)}\n` +
      `*GRAND TOTAL: $${total.toFixed(2)}*\n\n` +
      `I've also downloaded the PDF summary to share with you!`;

    // 3. Open WhatsApp
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');

    // 4. Clear cart and go home
    onComplete();
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark">
      <div className="flex items-center p-4 sticky top-0 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md z-10">
        <button onClick={onBack} className="text-[#181411] dark:text-white flex size-12 items-center justify-start">
          <span className="material-symbols-outlined">arrow_back_ios</span>
        </button>
        <h2 className="text-lg font-bold flex-1 text-center pr-12 font-display">Order Summary</h2>
      </div>

      <div className="flex flex-col items-center justify-center pt-6 pb-2">
        <div className={`p-3 rounded-full mb-3 transition-colors duration-500 ${progress === 100 ? 'bg-green-100 dark:bg-green-900/30' : 'bg-amber-50 dark:bg-amber-900/20'}`}>
          <span className={`material-symbols-outlined text-4xl ${progress === 100 ? 'check_circle' : 'pending'} ${progress === 100 ? 'text-green-600 dark:text-green-400' : 'text-amber-500 dark:text-amber-400'}`}>
            {progress === 100 ? 'check_circle' : 'pending'}
          </span>
        </div>
        <h4 className="text-xl font-bold font-display">{progress === 100 ? 'Summary Ready' : 'Processing Order'}</h4>
        <p className="text-[#897261] dark:text-gray-400 text-sm text-center px-6">
          {progress === 100 ? 'Your order has been compiled and is ready to send.' : 'We are preparing your artisanal bake summary...'}
        </p>
      </div>

      <div className="flex flex-col gap-3 p-4">
        <div className="flex justify-between">
          <p className="text-base font-medium">Generating your order summary...</p>
          <p className="text-sm font-bold">{progress}%</p>
        </div>
        <div className="rounded-full bg-[#e6e0db] dark:bg-gray-700 overflow-hidden h-2">
          <div
            className="h-full bg-primary transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Receipt Card */}
      <div
        className={`p-4 transition-all duration-700 ease-out transform ${progress === 100 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'
          }`}
      >
        <div className="flex flex-col rounded-xl shadow-lg bg-white dark:bg-stone-800 overflow-hidden border border-[#e6e0db] dark:border-stone-700">
          <div className="p-6 flex flex-col items-center border-b border-dashed border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-900/20">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-3">
              <span className="material-symbols-outlined text-primary text-3xl">bakery_dining</span>
            </div>
            <p className="text-xl font-bold font-display">The Home Bake</p>
            <div className="mt-2 text-center">
              <p className="text-[#897261] dark:text-stone-400 text-[10px] font-bold uppercase tracking-widest">Order ID: #{orderId}</p>
            </div>
          </div>

          <div className="p-6">
            <div className="mb-6 bg-primary/5 dark:bg-primary/10 rounded-xl p-4 border border-primary/10">
              <div className="flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-primary text-lg">local_shipping</span>
                <p className="text-xs font-bold uppercase tracking-wider text-primary">{fulfillment} Details</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <span className="text-[10px] text-[#897261] dark:text-stone-500 uppercase font-bold">Scheduled Date</span>
                  <span className="text-sm font-bold">Nov {deliveryDate}, 2023</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-[#897261] dark:text-stone-500 uppercase font-bold">Preferred Time</span>
                  <span className="text-sm font-bold">{deliveryTime}</span>
                </div>
              </div>
              {fulfillment === 'Delivery' && address && (
                <div className="mt-4 pt-4 border-t border-primary/10">
                  <span className="text-[10px] text-[#897261] dark:text-stone-500 uppercase font-bold block mb-1">Delivery Address</span>
                  <span className="text-sm font-medium text-stone-700 dark:text-stone-200">{address}</span>
                </div>
              )}
            </div>

            {notes && (
              <div className="mb-6 bg-stone-50 dark:bg-stone-900/40 rounded-xl p-4 border border-stone-100 dark:border-stone-700">
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-[#897261] text-lg">sticky_note_2</span>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#897261]">Special Instructions</p>
                </div>
                <p className="text-sm text-stone-600 dark:text-stone-300 italic">"{notes}"</p>
              </div>
            )}

            <h3 className="text-xs font-bold text-[#897261] dark:text-stone-500 uppercase tracking-widest mb-4">Order Items</h3>
            <div className="space-y-3">
              {cart.map((item, idx) => (
                <div key={idx} className="flex justify-between items-start">
                  <div className="flex flex-col">
                    <p className="text-sm font-medium">{item.quantity}x {item.product.name}</p>
                    {item.selectedSize && <p className="text-[10px] text-stone-400 uppercase">{item.selectedSize} {item.selectedVariant ? `· ${item.selectedVariant}` : ''}</p>}
                  </div>
                  <p className="text-sm font-bold">${(item.product.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-stone-100 dark:border-stone-700 space-y-2">
              <div className="flex justify-between text-sm">
                <p className="text-[#897261] dark:text-stone-400">Subtotal</p>
                <p className="font-medium">${subtotal.toFixed(2)}</p>
              </div>
              <div className="flex justify-between text-sm">
                <p className="text-[#897261] dark:text-stone-400">{fulfillment} Fee</p>
                <p className="font-medium">${deliveryFee.toFixed(2)}</p>
              </div>
              <div className="flex justify-between items-center pt-2 mt-2 border-t border-stone-100 dark:border-stone-700">
                <p className="text-lg font-bold font-display">Grand Total</p>
                <p className="text-primary text-2xl font-bold font-display">${total.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="bg-stone-50 dark:bg-stone-900/50 p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-stone-400">inventory_2</span>
              <span className="text-[10px] font-bold text-stone-500 uppercase">Ready to send</span>
            </div>
            <button
              onClick={handleDownloadPDF}
              className="flex items-center rounded-lg h-8 px-4 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-600 text-[11px] font-bold uppercase tracking-wider hover:bg-stone-50 transition-colors"
            >
              <span className="material-symbols-outlined text-sm mr-2">download</span>
              Preview PDF
            </button>
          </div>
        </div>
      </div>

      <div className={`mt-auto p-4 pb-10 bg-background-light dark:bg-background-dark border-t border-stone-200 dark:border-stone-800 transition-opacity duration-500 ${progress === 100 ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
        <p className="text-[#897261] dark:text-stone-400 text-xs text-center mb-4 px-6">
          Send this summary to confirm your order and begin the baking magic.
        </p>
        <button
          onClick={handleWhatsAppOrder}
          disabled={progress < 100}
          className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-xl h-14 bg-whatsapp hover:brightness-110 active:scale-[0.98] text-white text-base font-bold leading-normal shadow-lg shadow-green-500/20 transition-all font-display"
        >
          <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
            <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.412 2.503 1.111 3.492l-.719 2.612 2.677-.702c.945.612 2.068.964 3.273.964 3.182 0 5.767-2.584 5.768-5.764 0-3.18-2.586-5.768-5.742-5.768zm3.385 8.165c-.146.411-.741.764-1.018.81-.277.045-.533.064-.813-.024-.28-.088-.475-.152-1.373-.553-1.428-.636-2.31-2.071-2.31-2.164 0-.094-.035-.39-.035-.688 0-.297.155-.444.21-.505.054-.06.12-.075.161-.075.04 0 .08 0 .114.004.037.001.087-.014.135.1.049.117.165.405.18.435.015.03.024.066.004.105-.02.04-.044.064-.088.118-.044.053-.095.101-.137.15-.045.05-.094.104-.04.195.054.091.24.398.514.64.354.312.651.408.742.453.091.045.144.037.198-.023.054-.06.23-.267.292-.358.061-.09.123-.075.207-.044.084.031.53.25.621.293.091.045.152.066.173.104.022.039.022.22-.124.631z"></path>
          </svg>
          Send Summary via WhatsApp
        </button>
      </div>
    </div>
  );
};

export default OrderSummary;
