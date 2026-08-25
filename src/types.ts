export type Priority = 'low' | 'medium' | 'high';
export type Bucket = 'today' | 'upcoming';
export type FilterStatus = 'all' | 'active' | 'completed';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  bucket: Bucket;
  priority?: Priority;
  createdAt: number;
  completedAt?: number;
  dueDate?: string; // Optional YYYY-MM-DD
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AppSettings {
  soundEnabled: boolean;
  autoSortCompletedToBottom: boolean;
}
