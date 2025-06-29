export interface TaskList {
  id: string;
  name: string;
  description: string | null;
  list_type: string;
  default_status_id: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  created_by: string;
  updated_by: string | null;
  deleted_by: string | null;
}