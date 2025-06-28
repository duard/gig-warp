export interface Database {
  public: {
    Tables: {
      todos: {
        Row: {
          id: string;
          counter: number;
          text: string;
          done: boolean;
          created_at: string;
          updated_at: string;
          deleted: boolean;
        };
        Insert: {
          id?: string;
          counter?: number;
          text: string;
          done?: boolean;
          created_at?: string;
          updated_at?: string;
          deleted?: boolean;
        };
        Update: {
          id?: string;
          counter?: number;
          text?: string;
          done?: boolean;
          created_at?: string;
          updated_at?: string;
          deleted?: boolean;
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
