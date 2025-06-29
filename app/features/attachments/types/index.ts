export interface Attachment {
  id: string;
  file_id: string;
  target_type: string;
  target_id: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  created_by: string;
  updated_by: string | null;
  deleted_by: string | null;
}