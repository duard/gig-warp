import { supabase } from '@/lib/supabase';
import { Answer } from '../types';

export const answerService = {
  async getAllAnswers(): Promise<Answer[]> {
    const { data, error } = await supabase.from('answers').select('*');
    if (error) throw error;
    return data;
  },

  async getAnswerById(id: string): Promise<Answer | null> {
    const { data, error } = await supabase.from('answers').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  },

  async createAnswer(answer: Omit<Answer, 'id' | 'created_at' | 'updated_at' | 'deleted_at' | 'created_by' | 'updated_by' | 'deleted_by'>): Promise<Answer> {
    const { data, error } = await supabase.from('answers').insert(answer).select().single();
    if (error) throw error;
    return data;
  },

  async updateAnswer(id: string, updates: Partial<Answer>): Promise<Answer> {
    const { data, error } = await supabase.from('answers').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },

  async deleteAnswer(id: string): Promise<void> {
    const { error } = await supabase.from('answers').delete().eq('id', id);
    if (error) throw error;
  },
};