export interface File {
  id: string;
  storage_path: string;
  mime_type: string;
  file_name: string;
  byte_size: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  created_by: string;
  updated_by: string | null;
  deleted_by: string | null;
}