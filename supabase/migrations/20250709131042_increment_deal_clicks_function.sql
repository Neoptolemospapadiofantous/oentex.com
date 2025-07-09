-- supabase/migrations/YYYYMMDDHHMMSS_increment_deal_clicks_function.sql
CREATE OR REPLACE FUNCTION increment_deal_clicks(deal_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE company_deals 
  SET click_count = click_count + 1 
  WHERE id = deal_id;
END;
$$ LANGUAGE plpgsql;