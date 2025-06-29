import { supabase } from '@/lib/supabase';
import { File } from '../types';

export const fileService = {
  async getAllFiles(): Promise<File[]> {
    const { data, error } = await supabase.from('files').select('*');
    if (error) throw error;
    return data;
  },

  async getFileById(id: string): Promise<File | null> {
    const { data, error } = await supabase.from('files').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  },

  async createFile(file: Omit<File, 'id' | 'created_at' | 'updated_at' | 'deleted_at' | 'created_by' | 'updated_by' | 'deleted_by'>): Promise<File> {
    const { data, error } = await supabase.from('files').insert(file).select().single();
    if (error) throw error;
    return data;
  },

  async updateFile(id: string, updates: Partial<File>): Promise<File> {
    const { data, error } = await supabase.from('files').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },

  async deleteFile(id: string): Promise<void> {
    const { error } = await supabase.from('files').delete().eq('id', id);
    if (error) throw error;
  },
};