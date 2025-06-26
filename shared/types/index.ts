export interface ApiResponse<T = any> {
  data: T;
  error: string | null;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export interface SelectOption {
  label: string;
  value: string;
}

export type Theme = 'light' | 'dark' | 'system';

export type Priority = 'low' | 'medium' | 'high';

export type SortOrder = 'asc' | 'desc';

export interface SortOptions {
  field: string;
  order: SortOrder;
}
