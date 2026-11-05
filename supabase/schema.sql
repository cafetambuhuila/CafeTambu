-- Supabase Schema for Coffee Shop Platform

-- Create products table
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create settings table
CREATE TABLE settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name TEXT DEFAULT 'Café Artesanal La Sierra',
  logo_url TEXT,
  low_stock_days_warning INTEGER NOT NULL DEFAULT 7,
  follow_up_days_interval INTEGER NOT NULL DEFAULT 15,
  admin_whatsapp_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Initialize default settings
INSERT INTO settings (low_stock_days_warning, follow_up_days_interval)
VALUES (7, 15);

-- Create customers table
CREATE TABLE customers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES customers(id),
  total_amount DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, completed, cancelled
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create order items table
CREATE TABLE order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price_at_time DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- View for inventory projection (simplified version)
CREATE OR REPLACE VIEW inventory_projection AS
WITH sales_data AS (
  SELECT
    p.id AS product_id,
    COALESCE(SUM(oi.quantity), 0) AS total_sold_30_days
  FROM
    products p
  LEFT JOIN order_items oi ON p.id = oi.product_id
  LEFT JOIN orders o ON oi.order_id = o.id AND o.status = 'completed' AND o.created_at >= NOW() - INTERVAL '30 days'
  GROUP BY
    p.id
)
SELECT
  p.id,
  p.name,
  p.stock_quantity,
  sd.total_sold_30_days,
  CASE
    WHEN sd.total_sold_30_days > 0 THEN p.stock_quantity / (sd.total_sold_30_days / 30.0)
    ELSE 9999
  END AS estimated_days_remaining
FROM
  products p
JOIN sales_data sd ON p.id = sd.product_id;
