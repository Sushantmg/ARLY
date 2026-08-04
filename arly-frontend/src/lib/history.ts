import { supabase } from './supabase';
import type { ScrapeHistoryEntry } from '../types/product';

export interface ScrapeRecordInput {
  url: string;
  product_name: string | null;
  brand: string | null;
  category: string | null;
  current_price: number | null;
  source_site: string | null;
  source_url: string | null;
  image_url: string | null;
  method?: string | null;
  result_data?: Record<string, unknown> | null;
}

const DEDUPE_WINDOW_HOURS = 24;

/**
 * Record a scrape into the user's history.
 * Skips silently when not logged in, on failure, or when the same URL
 * was scraped within the dedupe window.
 */
export async function recordScrape(userId: string | null | undefined, input: ScrapeRecordInput): Promise<void> {
  if (!userId) return;

  const since = new Date(Date.now() - DEDUPE_WINDOW_HOURS * 60 * 60 * 1000).toISOString();
  const { data: existing, error: checkError } = await supabase
    .from('scrape_history')
    .select('id')
    .eq('user_id', userId)
    .eq('url', input.url)
    .gte('created_at', since)
    .limit(1);

  if (checkError) {
    console.error('Failed to check scrape history:', checkError.message);
    return;
  }
  if (existing && existing.length > 0) return;

  const { error } = await supabase.from('scrape_history').insert({
    user_id: userId,
    url: input.url,
    product_name: input.product_name,
    brand: input.brand,
    category: input.category,
    current_price: input.current_price,
    source_site: input.source_site,
    source_url: input.source_url,
    image_url: input.image_url,
    method: input.method ?? null,
    result_data: input.result_data ?? null,
  });

  if (error) console.error('Failed to record scrape history:', error.message);
}

export async function fetchHistory(userId: string): Promise<ScrapeHistoryEntry[]> {
  const { data, error } = await supabase
    .from('scrape_history')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) throw new Error(error.message);
  return (data as ScrapeHistoryEntry[]) ?? [];
}

export async function deleteHistoryEntry(id: string): Promise<void> {
  const { error } = await supabase.from('scrape_history').delete().eq('id', id);
  if (error) throw new Error(error.message);
}
