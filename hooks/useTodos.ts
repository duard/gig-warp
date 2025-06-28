import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { NewTodo, UpdateTodo, Todo } from '../types/database';
import { useSupabase } from '../providers/SupabaseProvider';

export const useTodos = () => {
  const { user } = useSupabase();
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    if (user) {
      fetchTodos();
    }
  }, [user]);

  const fetchTodos = async () => {
    if (!user) return;
    
    console.log('📥 Fetching todos from Supabase...');
    
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .eq('deleted', false) // Only get non-deleted todos
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error fetching todos:', error.message);
    } else {
      console.log('✅ Fetched todos:', data?.length || 0, 'records');
      console.log('📋 Todos data:', data);
      setTodos(data || []);
    }
  };

  const addTodo = async (newTodo: { text: string }) => {
    if (!user) return;
    
    console.log('➕ Adding new todo:', newTodo.text);
    
    const { data, error } = await supabase
      .from('todos')
      .insert([{ 
        text: newTodo.text,
        done: false,
        deleted: false,
        updated_at: new Date().toISOString()
      }])
      .select();

    if (error) {
      console.error('❌ Error adding todo:', error.message);
    } else {
      console.log('✅ Todo added successfully:', data);
      // Refresh the list to make sure we have the latest data
      fetchTodos();
    }
  };

  const updateTodo = async (id: string, update: { done?: boolean; text?: string }) => {
    console.log('🔄 Updating todo:', id, update);
    
    const { error } = await supabase
      .from('todos')
      .update({ 
        ...update,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      console.error('❌ Error updating todo:', error.message);
    } else {
      console.log('✅ Todo updated successfully');
      // Refresh the list to get the updated data
      fetchTodos();
    }
  };

  const deleteTodo = async (id: string) => {
    console.log('🗑️ Soft deleting todo:', id);
    
    // Soft delete by setting deleted = true
    const { error } = await supabase
      .from('todos')
      .update({ 
        deleted: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      console.error('❌ Error deleting todo:', error.message);
    } else {
      console.log('✅ Todo deleted successfully');
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    }
  };

  return {
    todos,
    addTodo,
    updateTodo,
    deleteTodo,
    fetchTodos,
  };
};

