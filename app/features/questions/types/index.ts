export interface Question {
  id: string;
  task_list_id: string;
  question_text: string;
  description: string | null;
  answer_type_id: string;
  is_required: boolean;
  order_index: number;
  options: any | null; // jsonb type
  default_status_id: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  created_by: string;
  updated_by: string | null;
  deleted_by: string | null;
}