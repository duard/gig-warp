import { apiService } from '@/services/api';
import { supabase } from '@/lib/supabase';
import { 
  User, 
  UserProfile, 
  CreateUserInput, 
  UpdateUserInput, 
  UpdateUserProfileInput 
} from '../types';
import { ApiResponse } from '@/shared/types';

class UserService {
  // Create a new user
  async createUser(input: CreateUserInput): Promise<ApiResponse<User>> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: input.email,
        password: input.password,
        options: {
          data: {
            first_name: input.firstName,
            last_name: input.lastName,
          }
        }
      });

      if (error) throw error;

      if (data.user) {
        const user: User = {
          id: data.user.id,
          email: data.user.email!,
          firstName: input.firstName,
          lastName: input.lastName,
          createdAt: data.user.created_at,
          updatedAt: data.user.updated_at || data.user.created_at,
        };

        return {
          data: user,
          error: null,
          success: true,
          message: 'User created successfully'
        };
      }

      throw new Error('Failed to create user');
    } catch (error: any) {
      return {
        data: null as any,
        error: error.message,
        success: false,
      };
    }
  }

  // Get all users (admin function)
  async getUsers(): Promise<ApiResponse<User[]>> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const users: User[] = data?.map(profile => ({
        id: profile.id,
        email: profile.email || '',
        firstName: profile.first_name,
        lastName: profile.last_name,
        avatar: profile.avatar_url,
        createdAt: profile.created_at,
        updatedAt: profile.updated_at,
      })) || [];

      return {
        data: users,
        error: null,
        success: true,
      };
    } catch (error: any) {
      return {
        data: [],
        error: error.message,
        success: false,
      };
    }
  }

  // Get user by ID
  async getUserById(id: string): Promise<ApiResponse<User>> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      const user: User = {
        id: data.id,
        email: data.email || '',
        firstName: data.first_name,
        lastName: data.last_name,
        avatar: data.avatar_url,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };

      return {
        data: user,
        error: null,
        success: true,
      };
    } catch (error: any) {
      return {
        data: null as any,
        error: error.message,
        success: false,
      };
    }
  }

  // Update user
  async updateUser(id: string, input: UpdateUserInput): Promise<ApiResponse<User>> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          first_name: input.firstName,
          last_name: input.lastName,
          avatar_url: input.avatar,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      const user: User = {
        id: data.id,
        email: data.email || '',
        firstName: data.first_name,
        lastName: data.last_name,
        avatar: data.avatar_url,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };

      return {
        data: user,
        error: null,
        success: true,
        message: 'User updated successfully'
      };
    } catch (error: any) {
      return {
        data: null as any,
        error: error.message,
        success: false,
      };
    }
  }

  // Delete user
  async deleteUser(id: string): Promise<ApiResponse<void>> {
    try {
      const { error } = await supabase.auth.admin.deleteUser(id);

      if (error) throw error;

      return {
        data: undefined as any,
        error: null,
        success: true,
        message: 'User deleted successfully'
      };
    } catch (error: any) {
      return {
        data: undefined as any,
        error: error.message,
        success: false,
      };
    }
  }

  // Get current user
  async getCurrentUser(): Promise<ApiResponse<User | null>> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error) throw error;

      if (!user) {
        return {
          data: null,
          error: null,
          success: true,
        };
      }

      const currentUser: User = {
        id: user.id,
        email: user.email!,
        firstName: user.user_metadata?.first_name,
        lastName: user.user_metadata?.last_name,
        avatar: user.user_metadata?.avatar_url,
        createdAt: user.created_at,
        updatedAt: user.updated_at || user.created_at,
      };

      return {
        data: currentUser,
        error: null,
        success: true,
      };
    } catch (error: any) {
      return {
        data: null,
        error: error.message,
        success: false,
      };
    }
  }
}

export const userService = new UserService();
