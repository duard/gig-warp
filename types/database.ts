export interface Database {
  public: {
    Tables: {
      todos: {
        Row: {
          id: string;
          created_at: string;
          title: string;
          description: string | null;
          completed: boolean;
          due_date: string | null;
          priority: 'low' | 'medium' | 'high' | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          title: string;
          description?: string | null;
          completed?: boolean;
          due_date?: string | null;
          priority?: 'low' | 'medium' | 'high' | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          title?: string;
          description?: string | null;
          completed?: boolean;
          due_date?: string | null;
          priority?: 'low' | 'medium' | 'high' | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

export type Todo = Database['public']['Tables']['todos']['Row'];
export type NewTodo = Database['public']['Tables']['todos']['Insert'];
export type UpdateTodo = Database['public']['Tables']['todos']['Update'];
