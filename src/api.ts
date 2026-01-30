import { supabase } from './lib/supabaseClient';
import { Product, CartItem, FulfillmentMethod } from './types';

export interface StoreSettings {
    id: number;
    bakery_name: string;
    whatsapp_number: string;
}

// Product CRUD
export const fetchProductById = async (id: string): Promise<Product | null> => {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching product:', error);
        return null; // Or throw
    }
    return data;
};

export const createProduct = async (product: Omit<Product, 'id'>) => {
    const { data, error } = await supabase
        .from('products')
        .insert([product])
        .select()
        .single();

    if (error) throw error;
    return data;
};

export const updateProduct = async (id: string, updates: Partial<Product>) => {
    const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data;
};

export const deleteProduct = async (id: string) => {
    const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

    if (error) throw error;
};

// Settings CRUD
export const fetchStoreSettings = async (): Promise<StoreSettings | null> => {
    const { data, error } = await supabase
        .from('store_settings')
        .select('*')
        .single();

    if (error) {
        console.warn('Error fetching settings (might be empty):', error);
        return null;
    }
    return data;
};

export const updateStoreSettings = async (settings: Partial<StoreSettings>) => {
    // We assume there's only one row, so we update where id=1 or just the first one found.
    // Or we can use an upsert if we know the ID.
    // Since we seeded it, we can fetch first.

    // Better approach for single row table:
    const { data, error } = await supabase
        .from('store_settings')
        .update(settings)
        .gt('id', 0) // Update all rows (should be only one)
        .select()
        .single();

    if (error) throw error;
    return data;
};


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
    customer_contact?: string; // Could add this field to UI later if needed
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
                delivery_date: orderData.delivery_date,
                delivery_time: orderData.delivery_time,
                address: orderData.address,
                notes: orderData.notes,
                status: 'pending'
            }
        ]);

    if (error) {
        console.error('Error creating order:', error);
        throw error;
    }

    return data;
};
