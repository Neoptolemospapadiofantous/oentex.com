/*
  # Create affiliate system database schema

  1. New Tables
    - `deals`
      - `id` (uuid, primary key)
      - `merchant_name` (text)
      - `title` (text)
      - `description` (text)
      - `terms` (text)
      - `commission_rate` (decimal)
      - `tracking_link` (text)
      - `start_date` (timestamptz)
      - `end_date` (timestamptz)
      - `category` (text)
      - `status` (text)
      - `bonus_amount` (text)
      - `rating` (decimal)
      - `features` (jsonb)
      - `image_url` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `email_subscribers`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `subscribed_at` (timestamptz)
      - `status` (text)
    
    - `contact_messages`
      - `id` (uuid, primary key)
      - `first_name` (text)
      - `last_name` (text)
      - `email` (text)
      - `subject` (text)
      - `message` (text)
      - `status` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access on deals
    - Add policies for inserting contact messages and email subscriptions
*/

-- Create deals table
CREATE TABLE IF NOT EXISTS deals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_name text NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  terms text,
  commission_rate decimal(5,2),
  tracking_link text NOT NULL,
  start_date timestamptz DEFAULT now(),
  end_date timestamptz,
  category text NOT NULL DEFAULT 'crypto',
  status text NOT NULL DEFAULT 'active',
  bonus_amount text,
  rating decimal(2,1) DEFAULT 4.5,
  features jsonb DEFAULT '[]'::jsonb,
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create email subscribers table
CREATE TABLE IF NOT EXISTS email_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  subscribed_at timestamptz DEFAULT now(),
  status text DEFAULT 'active'
);

-- Create contact messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  status text DEFAULT 'new',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Create policies for deals (public read access)
CREATE POLICY "Anyone can read active deals"
  ON deals
  FOR SELECT
  USING (status = 'active');

-- Create policies for email subscribers (public insert)
CREATE POLICY "Anyone can subscribe to newsletter"
  ON email_subscribers
  FOR INSERT
  WITH CHECK (true);

-- Create policies for contact messages (public insert)
CREATE POLICY "Anyone can send contact messages"
  ON contact_messages
  FOR INSERT
  WITH CHECK (true);

-- Insert sample deals
INSERT INTO deals (merchant_name, title, description, terms, commission_rate, tracking_link, category, bonus_amount, rating, features, image_url) VALUES
('Binance', 'Get $100 Trading Bonus', 'Sign up and get a $100 trading bonus when you deposit $500 or more', 'Minimum deposit $500. Bonus credited within 24 hours. Terms apply.', 15.00, 'https://binance.com/ref/cryptovault', 'crypto', '$100 Bonus', 4.8, '["Zero Trading Fees", "Advanced Charts", "24/7 Support"]', 'https://images.pexels.com/photos/730547/pexels-photo-730547.jpeg'),
('Coinbase', 'Earn $10 in Bitcoin', 'Complete your first trade and earn $10 in Bitcoin instantly', 'Valid for new users only. Minimum trade $25.', 12.50, 'https://coinbase.com/join/cryptovault', 'crypto', '$10 Bitcoin', 4.7, '["Beginner Friendly", "Secure Wallet", "Mobile App"]', 'https://images.pexels.com/photos/844124/pexels-photo-844124.jpeg'),
('Kraken', 'Pro Trading Features', 'Access professional trading tools with reduced fees for new users', '50% fee discount for first 30 days. Pro features included.', 18.00, 'https://kraken.com/ref/cryptovault', 'crypto', '50% Fee Discount', 4.6, '["Advanced Trading", "Low Fees", "High Liquidity"]', 'https://images.pexels.com/photos/1447418/pexels-photo-1447418.jpeg'),
('eToro', 'Social Trading Platform', 'Copy successful traders and get a welcome bonus on your first deposit', 'Welcome bonus up to $1000. Copy trading available.', 20.00, 'https://etoro.com/ref/cryptovault', 'stocks', '$50 Welcome', 4.5, '["Copy Trading", "Social Features", "Multi-Asset"]', 'https://images.pexels.com/photos/590041/pexels-photo-590041.jpeg'),
('Robinhood', 'Commission-Free Trading', 'Trade stocks and crypto with zero commission fees', 'No minimum deposit. Commission-free trading.', 10.00, 'https://robinhood.com/ref/cryptovault', 'stocks', 'Free Stock', 4.4, '["Commission Free", "Easy Interface", "Fractional Shares"]', 'https://images.pexels.com/photos/590020/pexels-photo-590020.jpeg'),
('Webull', 'Advanced Stock Trading', 'Get free stocks worth up to $12,000 when you open and fund your account', 'Free stocks based on deposit amount. Advanced tools included.', 14.00, 'https://webull.com/ref/cryptovault', 'stocks', 'Free Stocks', 4.6, '["Advanced Tools", "Extended Hours", "Research Reports"]', 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg');