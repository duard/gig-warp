export interface ExternalUser {
  id: string;
  supabase_user_id: string;
  external_system: string;
  external_user_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  created_by: string;
  updated_by: string | null;
  deleted_by: string | null;
}