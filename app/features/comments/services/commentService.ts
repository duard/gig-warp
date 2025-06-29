import { supabase } from '@/lib/supabase';
import { Comment } from '../types';

export const commentService = {
  async getAllComments(): Promise<Comment[]> {
    const { data, error } = await supabase.from('comments').select('*');
    if (error) throw error;
    return data;
  },

  async getCommentById(id: string): Promise<Comment | null> {
    const { data, error } = await supabase.from('comments').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  },

  async createComment(comment: Omit<Comment, 'id' | 'created_at' | 'updated_at' | 'deleted_at' | 'created_by' | 'updated_by' | 'deleted_by'>): Promise<Comment> {
    const { data, error } = await supabase.from('comments').insert(comment).select().single();
    if (error) throw error;
    return data;
  },

  async updateComment(id: string, updates: Partial<Comment>): Promise<Comment> {
    const { data, error } = await supabase.from('comments').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },

  async deleteComment(id: string): Promise<void> {
    const { error } = await supabase.from('comments').delete().eq('id', id);
    if (error) throw error;
  },
};