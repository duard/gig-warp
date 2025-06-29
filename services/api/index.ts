import { supabase } from '@/lib/supabase';
import { ApiResponse } from '@/shared/types';

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.EXPO_PUBLIC_API_URL || process.env.API_URL || 'http://localhost:3000/api';
  }

  // Generic HTTP methods
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T[]>> {
    try {
      const { data, error } = await supabase
        .from(endpoint)
        .select('*')
        .match(params || {});

      if (error) throw error;

      return {
        data: data as T[],
        error: null,
        success: true,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async post<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
    try {
      const { data, error } = await supabase
        .from(endpoint)
        .insert(body)
        .select()
        .single();

      if (error) throw error;

      return {
        data,
        error: null,
        success: true,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async put<T>(endpoint: string, id: string, body: any): Promise<ApiResponse<T>> {
    try {
      const { data, error } = await supabase
        .from(endpoint)
        .update(body)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return {
        data,
        error: null,
        success: true,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async delete<T>(endpoint: string, id: string): Promise<ApiResponse<T>> {
    try {
      const { error } = await supabase
        .from(endpoint)
        .delete()
        .eq('id', id);

      if (error) throw error;

      return {
        data: null as T,
        error: null,
        success: true,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  // Authentication helpers
  async getAuthHeaders(): Promise<Record<string, string>> {
    const { data: { session } } = await supabase.auth.getSession();
    
    return {
      'Content-Type': 'application/json',
      ...(session?.access_token && {
        'Authorization': `Bearer ${session.access_token}`,
      }),
    };
  }

  private handleError(error: any): ApiResponse<any> {
    console.error('API Error:', error);
    
    return {
      data: null,
      error: error.message || 'An unexpected error occurred',
      success: false,
    };
  }
}

export const apiService = new ApiService();
