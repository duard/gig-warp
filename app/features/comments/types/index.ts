export interface Comment {
  id: string;
  target_type: string;
  target_id: string;
  user_id: string;
  content: string;
  status_id: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  created_by: string;
  updated_by: string | null;
  deleted_by: string | null;
}