import { supabase } from '@/lib/supabase';
import { Approval } from '../types';

export const approvalService = {
  async getAllApprovals(): Promise<Approval[]> {
    const { data, error } = await supabase.from('approvals').select('*');
    if (error) throw error;
    return data;
  },

  async getApprovalById(id: string): Promise<Approval | null> {
    const { data, error } = await supabase.from('approvals').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  },

  async createApproval(approval: Omit<Approval, 'id' | 'created_at' | 'updated_at' | 'deleted_at' | 'created_by' | 'updated_by' | 'deleted_by'>): Promise<Approval> {
    const { data, error } = await supabase.from('approvals').insert(approval).select().single();
    if (error) throw error;
    return data;
  },

  async updateApproval(id: string, updates: Partial<Approval>): Promise<Approval> {
    const { data, error } = await supabase.from('approvals').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },

  async deleteApproval(id: string): Promise<void> {
    const { error } = await supabase.from('approvals').delete().eq('id', id);
    if (error) throw error;
  },
};