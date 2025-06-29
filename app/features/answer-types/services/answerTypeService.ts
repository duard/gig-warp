import { supabase } from '@/lib/supabase';
import { AnswerType } from '../types';

export const answerTypeService = {
  async getAllAnswerTypes(): Promise<AnswerType[]> {
    const { data, error } = await supabase.from('answer_types').select('*');
    if (error) throw error;
    return data;
  },

  async getAnswerTypeById(id: string): Promise<AnswerType | null> {
    const { data, error } = await supabase.from('answer_types').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  },

  async createAnswerType(answerType: Omit<AnswerType, 'id' | 'created_at' | 'updated_at' | 'deleted_at' | 'created_by' | 'updated_by' | 'deleted_by'>): Promise<AnswerType> {
    const { data, error } = await supabase.from('answer_types').insert(answerType).select().single();
    if (error) throw error;
    return data;
  },

  async updateAnswerType(id: string, updates: Partial<AnswerType>): Promise<AnswerType> {
    const { data, error } = await supabase.from('answer_types').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },

  async deleteAnswerType(id: string): Promise<void> {
    const { error } = await supabase.from('answer_types').delete().eq('id', id);
    if (error) throw error;
  },
};