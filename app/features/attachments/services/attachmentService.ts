import { supabase } from '@/lib/supabase';
import { Attachment } from '../types';

export const attachmentService = {
  async getAllAttachments(): Promise<Attachment[]> {
    const { data, error } = await supabase.from('attachments').select('*');
    if (error) throw error;
    return data;
  },

  async getAttachmentById(id: string): Promise<Attachment | null> {
    const { data, error } = await supabase.from('attachments').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  },

  async createAttachment(attachment: Omit<Attachment, 'id' | 'created_at' | 'updated_at' | 'deleted_at' | 'created_by' | 'updated_by' | 'deleted_by'>): Promise<Attachment> {
    const { data, error } = await supabase.from('attachments').insert(attachment).select().single();
    if (error) throw error;
    return data;
  },

  async updateAttachment(id: string, updates: Partial<Attachment>): Promise<Attachment> {
    const { data, error } = await supabase.from('attachments').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },

  async deleteAttachment(id: string): Promise<void> {
    const { error } = await supabase.from('attachments').delete().eq('id', id);
    if (error) throw error;
  },
};