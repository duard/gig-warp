import { supabase } from '@/lib/supabase';
import { StatusType } from '../types';

export const statusTypeService = {
  async getAllStatusTypes(): Promise<StatusType[]> {
    const { data, error } = await supabase.from('status_types').select('*');
    if (error) throw error;
    return data;
  },

  async getStatusTypeById(id: string): Promise<StatusType | null> {
    const { data, error } = await supabase.from('status_types').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  },

  async createStatusType(statusType: Omit<StatusType, 'id' | 'created_at' | 'updated_at' | 'deleted_at' | 'created_by' | 'updated_by' | 'deleted_by'>): Promise<StatusType> {
    const { data, error } = await supabase.from('status_types').insert(statusType).select().single();
    if (error) throw error;
    return data;
  },

  async updateStatusType(id: string, updates: Partial<StatusType>): Promise<StatusType> {
    const { data, error } = await supabase.from('status_types').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },

  async deleteStatusType(id: string): Promise<void> {
    const { error } = await supabase.from('status_types').delete().eq('id', id);
    if (error) throw error;
  },
};