
export enum Screen {
  Welcome = 'WELCOME',
  Storefront = 'STOREFRONT',
  ProductDetail = 'PRODUCT_DETAIL',
  Cart = 'CART',
  OrderSummary = 'ORDER_SUMMARY'
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  status: 'In Stock' | 'Pre-order' | 'Out of Stock';
  rating: number;
  reviews: number;
  sizes?: { name: string; feeds: string }[];
  variants?: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedVariant?: string;
}

export type FulfillmentMethod = 'Delivery' | 'Pickup';
