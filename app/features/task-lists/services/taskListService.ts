import { supabase } from '@/lib/supabase';
import { TaskList } from '../types';

export const taskListService = {
  async getAllTaskLists(): Promise<TaskList[]> {
    const { data, error } = await supabase.from('task_lists').select('*');
    if (error) throw error;
    return data;
  },

  async getTaskListById(id: string): Promise<TaskList | null> {
    const { data, error } = await supabase.from('task_lists').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  },

  async createTaskList(taskList: Omit<TaskList, 'id' | 'created_at' | 'updated_at' | 'deleted_at' | 'created_by' | 'updated_by' | 'deleted_by'>): Promise<TaskList> {
    const { data, error } = await supabase.from('task_lists').insert(taskList).select().single();
    if (error) throw error;
    return data;
  },

  async updateTaskList(id: string, updates: Partial<TaskList>): Promise<TaskList> {
    const { data, error } = await supabase.from('task_lists').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },

  async deleteTaskList(id: string): Promise<void> {
    const { error } = await supabase.from('task_lists').delete().eq('id', id);
    if (error) throw error;
  },
};