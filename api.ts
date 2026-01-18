import { supabase } from './lib/supabaseClient';
import { Product, CartItem, FulfillmentMethod } from './types';

export const fetchProducts = async (): Promise<Product[]> => {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name');

    if (error) {
        console.error('Error fetching products:', error);
        throw error;
    }

    return data as Product[];
};

export interface OrderData {
    items: CartItem[];
    total_amount: number;
    delivery_fee: number;
    fulfillment_method: FulfillmentMethod;
    delivery_date: string;
    delivery_time: string;
    address: string;
    notes: string;
    customer_contact?: string;
}

export const createOrder = async (orderData: OrderData) => {
    const { data, error } = await supabase
        .from('orders')
        .insert([
            {
                items: orderData.items,
                total_amount: orderData.total_amount,
                delivery_fee: orderData.delivery_fee,
                fulfillment_method: orderData.fulfillment_method,
                delivery_date: orderData.delivery_date.toString(),
                delivery_time: orderData.delivery_time,
                address: orderData.address,
                notes: orderData.notes,
                status: 'pending'
            }
        ])
        .select();

    if (error) {
        console.error('Error creating order:', error);
        throw error;
    }

    return data;
};
