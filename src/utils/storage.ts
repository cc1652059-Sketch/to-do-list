import { Task, AppSettings, User } from '../types';

const STORAGE_KEY = 'minimal_tasks_app_items';
const SETTINGS_KEY = 'minimal_tasks_app_settings';
const USER_KEY = 'minimal_tasks_app_user';

export const INITIAL_USER: User = {
  id: 'usr-1',
  name: 'Alex Rivera',
  email: 'alex.rivera@student.edu',
};

export const INITIAL_TASKS: Task[] = [
  {
    id: 't-1',
    title: 'Review JavaScript concepts & async patterns',
    completed: true,
    bucket: 'today',
    priority: 'high',
    createdAt: Date.now() - 1000 * 60 * 180,
    completedAt: Date.now() - 1000 * 60 * 60,
  },
  {
    id: 't-2',
    title: 'Finish frontend assignment & responsive layout',
    completed: false,
    bucket: 'today',
    priority: 'high',
    createdAt: Date.now() - 1000 * 60 * 120,
  },
  {
    id: 't-3',
    title: 'Complete 30-minute afternoon workout',
    completed: false,
    bucket: 'today',
    priority: 'medium',
    createdAt: Date.now() - 1000 * 60 * 90,
  },
  {
    id: 't-4',
    title: 'Read chapter 4 of Clean Architecture',
    completed: false,
    bucket: 'today',
    priority: 'low',
    createdAt: Date.now() - 1000 * 60 * 45,
  },
  {
    id: 't-5',
    title: 'Prepare lecture notes on distributed systems',
    completed: false,
    bucket: 'upcoming',
    priority: 'medium',
    createdAt: Date.now() - 1000 * 60 * 240,
    dueDate: 'Tomorrow',
  },
  {
    id: 't-6',
    title: 'Submit research methodology draft to supervisor',
    completed: false,
    bucket: 'upcoming',
    priority: 'high',
    createdAt: Date.now() - 1000 * 60 * 300,
    dueDate: 'This Friday',
  },
  {
    id: 't-7',
    title: 'Organize study desk & backup project repositories',
    completed: true,
    bucket: 'upcoming',
    priority: 'low',
    createdAt: Date.now() - 1000 * 60 * 500,
    completedAt: Date.now() - 1000 * 60 * 200,
  }
];

export const DEFAULT_SETTINGS: AppSettings = {
  soundEnabled: true,
  autoSortCompletedToBottom: true,
};

export function loadTasksFromStorage(): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_TASKS;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
    return INITIAL_TASKS;
  } catch {
    return INITIAL_TASKS;
  }
}

export function saveTasksToStorage(tasks: Task[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch {
    // Ignore storage quota errors
  }
}

export function loadSettingsFromStorage(): AppSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettingsToStorage(settings: AppSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // Ignore
  }
}

export function loadUserFromStorage(): User | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveUserToStorage(user: User | null): void {
  try {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  } catch {
    // Ignore
  }
}
