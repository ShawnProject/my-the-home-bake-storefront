
import React, { useState, useMemo, useEffect } from 'react';
import { Screen, Product, CartItem, FulfillmentMethod } from '../types';
import { CATEGORIES, WHATSAPP_NUMBER } from '../constants';
import WelcomeScreen from '../components/WelcomeScreen';
import Storefront from '../components/Storefront';
import ProductDetail from '../components/ProductDetail';
import CartScreen from '../components/CartScreen';
import OrderSummary from '../components/OrderSummary';
import { fetchProducts, fetchStoreSettings, StoreSettings } from '../api';

const PublicStore: React.FC = () => {
    const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.Welcome);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [fulfillment, setFulfillment] = useState<FulfillmentMethod>('Delivery');
    const [deliveryDate, setDeliveryDate] = useState<Date>(new Date());
    const [deliveryTime, setDeliveryTime] = useState<string>('10:00 AM');
    const [address, setAddress] = useState<string>('');
    const [notes, setNotes] = useState<string>('');

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [settings, setSettings] = useState<StoreSettings | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [productsData, settingsData] = await Promise.all([
                    fetchProducts(),
                    fetchStoreSettings()
                ]);
                setProducts(productsData);
                setSettings(settingsData);
            } catch (error) {
                console.error("Failed to load data", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const cartCount = useMemo(() => cart.reduce((acc, item) => acc + item.quantity, 0), [cart]);
    const cartSubtotal = useMemo(() => cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0), [cart]);
    const deliveryFee = fulfillment === 'Delivery' ? 5.00 : 0;
    const grandTotal = cartSubtotal + deliveryFee;

    const handleAddToCart = (product: Product, quantity: number, size?: string, variant?: string) => {
        setCart(prev => {
            const existing = prev.find(item => item.product.id === product.id && item.selectedSize === size && item.selectedVariant === variant);
            if (existing) {
                return prev.map(item => item === existing ? { ...item, quantity: item.quantity + quantity } : item);
            }
            return [...prev, { product, quantity, selectedSize: size, selectedVariant: variant }];
        });
        setCurrentScreen(Screen.Storefront);
    };

    const updateQuantity = (productId: string, delta: number) => {
        setCart(prev => prev.map(item => {
            if (item.product.id === productId) {
                const newQty = Math.max(0, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        }).filter(item => item.quantity > 0));
    };

    const navigateToProduct = (product: Product) => {
        setSelectedProduct(product);
        setCurrentScreen(Screen.ProductDetail);
    };

    const renderScreen = () => {
        switch (currentScreen) {
            case Screen.Welcome:
                return <WelcomeScreen onStart={() => setCurrentScreen(Screen.Storefront)} />;
            case Screen.Storefront:
                if (loading) {
                    return <div className="flex h-screen items-center justify-center">Loading...</div>;
                }
                return (
                    <Storefront
                        products={products}
                        categories={CATEGORIES}
                        onProductClick={navigateToProduct}
                        onAddToCart={(p) => handleAddToCart(p, 1)}
                        onViewCart={() => setCurrentScreen(Screen.Cart)}
                        onBack={() => setCurrentScreen(Screen.Welcome)}
                        cartCount={cartCount}
                        updateQuantity={updateQuantity}
                        cart={cart}
                        bakeryName={settings?.bakery_name || 'The Home Bake'}
                    />
                );
            case Screen.ProductDetail:
                return selectedProduct ? (
                    <ProductDetail
                        product={selectedProduct}
                        onBack={() => setCurrentScreen(Screen.Storefront)}
                        onAddToCart={handleAddToCart}
                    />
                ) : null;
            case Screen.Cart:
                return (
                    <CartScreen
                        cart={cart}
                        updateQuantity={updateQuantity}
                        onBack={() => setCurrentScreen(Screen.Storefront)}
                        onCheckout={() => setCurrentScreen(Screen.OrderSummary)}
                        fulfillment={fulfillment}
                        setFulfillment={setFulfillment}
                        deliveryDate={deliveryDate}
                        setDeliveryDate={setDeliveryDate}
                        deliveryTime={deliveryTime}
                        setDeliveryTime={setDeliveryTime}
                        address={address}
                        setAddress={setAddress}
                        notes={notes}
                        setNotes={setNotes}
                        subtotal={cartSubtotal}
                        deliveryFee={deliveryFee}
                        total={grandTotal}
                    />
                );
            case Screen.OrderSummary:
                return (
                    <OrderSummary
                        cart={cart}
                        subtotal={cartSubtotal}
                        deliveryFee={deliveryFee}
                        total={grandTotal}
                        fulfillment={fulfillment}
                        deliveryDate={deliveryDate}
                        deliveryTime={deliveryTime}
                        address={address}
                        notes={notes}
                        onBack={() => setCurrentScreen(Screen.Cart)}
                        onComplete={() => {
                            setCart([]);
                            setNotes('');
                            setAddress('');
                            setCurrentScreen(Screen.Welcome);
                        }}
                        bakeryName={settings?.bakery_name || 'The Home Bake'}
                        whatsappNumber={settings?.whatsapp_number || WHATSAPP_NUMBER}
                    />
                );
            default:
                return <WelcomeScreen onStart={() => setCurrentScreen(Screen.Storefront)} />;
        }
    };

    return (
        <div className="max-w-[480px] mx-auto bg-white dark:bg-[#1c140e] shadow-2xl min-h-screen relative overflow-x-hidden">
            {renderScreen()}
        </div>
    );
};

export default PublicStore;
