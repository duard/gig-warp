import { createClient } from '@supabase/supabase-js';
import { observable } from '@legendapp/state';
import { syncedSupabase } from '@legendapp/state/sync-plugins/supabase';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { configureSynced } from '@legendapp/state/sync';
import { ObservablePersistAsyncStorage } from '@legendapp/state/persist-plugins/async-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Database } from '../../../types/database';

const supabase = createClient<Database>(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!
);

// Provide a function to generate ids locally
const generateId = () => uuidv4();

// Create a configured sync function
const customSynced = configureSynced(syncedSupabase, {
  // Use React Native Async Storage
  persist: {
    plugin: new ObservablePersistAsyncStorage({
      AsyncStorage,
    }),
  },
  generateId,
  supabase,
  changesSince: 'last-sync',
  fieldCreatedAt: 'created_at',
  fieldUpdatedAt: 'updated_at',
  // Enable soft deletes
  fieldDeleted: 'deleted',
});

export const todos$ = observable(
  customSynced({
    supabase,
    collection: 'todos',
    select: (from: any) =>
      from
        .select('id,text,done,created_at,updated_at,deleted')
        .order('updated_at', { ascending: false }),
    actions: ['read', 'create', 'update', 'delete'],
    realtime: true,
    persist: {
      name: 'todos',
      retrySync: true,
    },
    retry: {
      infinite: true,
    },
    fieldCreatedAt: 'created_at',
    fieldUpdatedAt: 'updated_at',
    fieldDeleted: 'deleted',
  })
);

// Add a new todo
export function addTodo(text: string) {
  const id = generateId();
  // Add keyed by id to the todos$ observable to trigger a create in Supabase
  todos$[id].assign({
    id,
    text,
    done: false,
    deleted: false,
  });
}

// Toggle the done status of a todo
export function toggleDone(id: string) {
  todos$[id].done.set((prev: boolean) => !prev);
}

// Soft delete a todo by setting deleted to true
export function softDeleteTodo(id: string) {
  todos$[id].deleted.set(true);
}

// Hard delete a todo (completely remove it)
export function hardDeleteTodo(id: string) {
  todos$[id].delete();
}

// Restore a soft-deleted todo
export function restoreTodo(id: string) {
  todos$[id].deleted.set(false);
}