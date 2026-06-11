'use server'

import { createClient } from '@/utils/supabase/server'

export type CsatMetrics = {
  global_average: number;
  total_reviews: number;
  department_ranking: {
    department_id: string;
    department_name: string;
    average_rating: number;
    total_reviews: number;
  }[];
  sentiment_counts?: {
    positive: number;
    neutral: number;
    negative: number;
  };
}

export type FeedbackEntry = {
  id: string;
  title: string;
  rating: number;
  feedback_notes: string;
  sentiment: string | null;
  created_at: string;
  department_id: string | null;
  departments?: {
    name: string;
  } | null;
}

export async function getCsatMetrics(prefeituraId: string): Promise<CsatMetrics> {
  const supabase = await createClient()
  
  const { data, error } = await supabase.rpc('get_csat_metrics', { p_prefeitura_id: prefeituraId })

  if (error) {
    console.error('Error fetching CSAT metrics:', error)
    throw new Error('Failed to fetch CSAT metrics')
  }

  return data as CsatMetrics
}

export async function getLatestFeedbacks(prefeituraId: string, limit: number = 50): Promise<FeedbackEntry[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('occurrences')
    .select('id, title, rating, feedback_notes, created_at, department_id, sentiment, departments(name)')
    .eq('prefeitura_id', prefeituraId)
    .not('rating', 'is', null)
    .not('feedback_notes', 'is', null)
    .neq('feedback_notes', '')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching latest feedbacks:', error)
    throw new Error('Failed to fetch latest feedbacks')
  }

  // Filter out any feedback that is just whitespace
  const filteredData = (data as any[]).map(d => ({
    id: d.id,
    title: d.title,
    rating: d.rating,
    feedback_notes: d.feedback_notes,
    sentiment: d.sentiment,
    created_at: d.created_at,
    department_id: d.department_id,
    departments: Array.isArray(d.departments) ? d.departments[0] : d.departments
  })).filter(entry => entry.feedback_notes.trim() !== '')

  return filteredData as FeedbackEntry[]
}
