-- Create products table
create table products (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  name text not null,
  price numeric not null,
  description text,
  image text,
  category text,
  status text check (status in ('In Stock', 'Pre-order')),
  rating numeric,
  reviews integer,
  sizes jsonb, -- Array of objects: [{"name": "6-inch", "feeds": "4-6"}]
  variants text[] -- Array of strings: ["Classic", "GF"]
);

-- Create orders table
create table orders (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  items jsonb not null, -- Stores the cart contents structure
  total_amount numeric not null,
  delivery_fee numeric default 0,
  fulfillment_method text,
  delivery_date text,
  delivery_time text,
  address text,
  notes text,
  customer_contact text, -- WhatsApp or Email
  status text default 'pending'
);

-- Enable Row Level Security (RLS) is recommended, but for now we will keep it open for public read on products
alter table products enable row level security;
alter table orders enable row level security;

-- Policy to allow anyone to read products
create policy "Public products are viewable by everyone"
on products for select
to public
using (true);

-- Policy to allow anyone to insert orders (for public storefront)
create policy "Anyone can create an order"
on orders for insert
to public
with check (true);
