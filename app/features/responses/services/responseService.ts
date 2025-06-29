import { supabase } from '@/lib/supabase';
import { Response } from '../types';

export const responseService = {
  async getAllResponses(): Promise<Response[]> {
    const { data, error } = await supabase.from('responses').select('*');
    if (error) throw error;
    return data;
  },

  async getResponseById(id: string): Promise<Response | null> {
    const { data, error } = await supabase.from('responses').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  },

  async createResponse(response: Omit<Response, 'id' | 'created_at' | 'updated_at' | 'deleted_at' | 'created_by' | 'updated_by' | 'deleted_by'>): Promise<Response> {
    const { data, error } = await supabase.from('responses').insert(response).select().single();
    if (error) throw error;
    return data;
  },

  async updateResponse(id: string, updates: Partial<Response>): Promise<Response> {
    const { data, error } = await supabase.from('responses').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },

  async deleteResponse(id: string): Promise<void> {
    const { error } = await supabase.from('responses').delete().eq('id', id);
    if (error) throw error;
  },
};