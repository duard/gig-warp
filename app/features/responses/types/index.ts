export interface Response {
  id: string;
  task_list_id: string;
  user_id: string;
  target_type: string;
  target_id: string;
  status_id: string | null;
  started_at: string;
  completed_at: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  created_by: string;
  updated_by: string | null;
  deleted_by: string | null;
}