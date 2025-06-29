export interface Approval {
  id: string;
  response_id: string;
  approver_id: string;
  status_id: string;
  notes: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  created_by: string;
  updated_by: string | null;
  deleted_by: string | null;
}