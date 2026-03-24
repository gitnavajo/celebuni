'use server';

import { createClient } from '@/lib/supabase';

/**
 * Server action to track a celebrity view
 */
export async function trackViewAction(celebrityId: string) {
  try {
    const supabase = createClient();
    
    const { data: celebrity } = await supabase
      .from('celebrities')
      .select('view_count')
      .eq('id', celebrityId)
      .single();

    if (celebrity) {
      await supabase
        .from('celebrities')
        .update({
          view_count: (celebrity.view_count || 0) + 1,
          last_viewed_at: new Date().toISOString(),
        })
        .eq('id', celebrityId);
    }
  } catch (error) {
    console.error('Error tracking view:', error);
  }
}

/**
 * Server action to track a search for a celebrity
 */
export async function trackSearchAction(celebrityId: string) {
  try {
    const supabase = createClient();
    
    const { data: celebrity } = await supabase
      .from('celebrities')
      .select('search_count')
      .eq('id', celebrityId)
      .single();

    if (celebrity) {
      await supabase
        .from('celebrities')
        .update({
          search_count: (celebrity.search_count || 0) + 1,
        })
        .eq('id', celebrityId);
    }
  } catch (error) {
    console.error('Error tracking search:', error);
  }
}
