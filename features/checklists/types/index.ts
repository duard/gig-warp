export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  checklistId: string;
  userId: string;
}

export interface Checklist {
  id: string;
  title: string;
  description?: string;
  color?: string;
  isPublic: boolean;
  userId: string;
  items: ChecklistItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateChecklistInput {
  title: string;
  description?: string;
  color?: string;
  isPublic?: boolean;
}

export interface UpdateChecklistInput {
  title?: string;
  description?: string;
  color?: string;
  isPublic?: boolean;
}

export interface CreateChecklistItemInput {
  text: string;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string;
  checklistId: string;
}

export interface UpdateChecklistItemInput {
  text?: string;
  completed?: boolean;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string;
}

export interface ChecklistFilters {
  completed?: boolean;
  priority?: 'low' | 'medium' | 'high';
  search?: string;
}
