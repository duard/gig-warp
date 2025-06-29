import { supabase } from '@/lib/supabase';
import { Question } from '../types';

export const questionService = {
  async getAllQuestions(): Promise<Question[]> {
    const { data, error } = await supabase.from('questions').select('*');
    if (error) throw error;
    return data;
  },

  async getQuestionById(id: string): Promise<Question | null> {
    const { data, error } = await supabase.from('questions').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  },

  async createQuestion(question: Omit<Question, 'id' | 'created_at' | 'updated_at' | 'deleted_at' | 'created_by' | 'updated_by' | 'deleted_by'>): Promise<Question> {
    const { data, error } = await supabase.from('questions').insert(question).select().single();
    if (error) throw error;
    return data;
  },

  async updateQuestion(id: string, updates: Partial<Question>): Promise<Question> {
    const { data, error } = await supabase.from('questions').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },

  async deleteQuestion(id: string): Promise<void> {
    const { error } = await supabase.from('questions').delete().eq('id', id);
    if (error) throw error;
  },
};