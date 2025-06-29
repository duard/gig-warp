import { supabase } from '@/lib/supabase';
import { ExternalUser } from '../types';

export const externalUserService = {
  async getAllExternalUsers(): Promise<ExternalUser[]> {
    const { data, error } = await supabase.from('external_users').select('*');
    if (error) throw error;
    return data;
  },

  async getExternalUserById(id: string): Promise<ExternalUser | null> {
    const { data, error } = await supabase.from('external_users').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  },

  async createExternalUser(externalUser: Omit<ExternalUser, 'id' | 'created_at' | 'updated_at' | 'deleted_at' | 'created_by' | 'updated_by' | 'deleted_by'>): Promise<ExternalUser> {
    const { data, error } = await supabase.from('external_users').insert(externalUser).select().single();
    if (error) throw error;
    return data;
  },

  async updateExternalUser(id: string, updates: Partial<ExternalUser>): Promise<ExternalUser> {
    const { data, error } = await supabase.from('external_users').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },

  async deleteExternalUser(id: string): Promise<void> {
    const { error } = await supabase.from('external_users').delete().eq('id', id);
    if (error) throw error;
  },
};