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
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error fetching todos:', error.message);
    } else {
      console.log('✅ Fetched todos:', data?.length || 0, 'records');
      console.log('📋 Todos data:', data);
      setTodos(data || []);
    }
  };

  const addTodo = async (newTodo: { title: string }) => {
    if (!user) return;
    
    console.log('➕ Adding new todo:', newTodo.title);
    
    const { data, error } = await supabase
      .from('todos')
      .insert([{ 
        title: newTodo.title,
        completed: false
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

  const updateTodo = async (id: string, update: { completed?: boolean; title?: string }) => {
    console.log('🔄 Updating todo:', id, update);
    
    const { error } = await supabase
      .from('todos')
      .update(update)
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
    console.log('🗑️ Deleting todo:', id);
    
    const { error } = await supabase
      .from('todos')
      .delete()
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

