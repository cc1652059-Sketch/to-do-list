import { useState, useEffect, useMemo, useCallback } from 'react';
import { Task, Bucket, FilterStatus, Priority, AppSettings, User } from './types';
import {
  loadTasksFromStorage,
  saveTasksToStorage,
  loadSettingsFromStorage,
  saveSettingsToStorage,
  loadUserFromStorage,
  saveUserToStorage,
  INITIAL_USER,
  INITIAL_TASKS,
} from './utils/storage';
import { playCompleteSound, playAddSound, playDeleteSound } from './utils/audio';
import { Header } from './components/Header';
import { ProgressSection } from './components/ProgressSection';
import { AddTaskForm } from './components/AddTaskForm';
import { TaskFilters } from './components/TaskFilters';
import { TaskList } from './components/TaskList';
import { SettingsModal } from './components/SettingsModal';
import { LoginPage } from './components/LoginPage';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = loadUserFromStorage();
    return saved !== null ? saved : INITIAL_USER;
  });
  const [currentView, setCurrentView] = useState<'tasks' | 'login'>('tasks');
  const [tasks, setTasks] = useState<Task[]>(() => loadTasksFromStorage());
  const [settings, setSettings] = useState<AppSettings>(() => loadSettingsFromStorage());
  const [activeBucket, setActiveBucket] = useState<Bucket>('today');
  const [activeFilter, setActiveFilter] = useState<FilterStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Sync to local storage on changes
  useEffect(() => {
    saveTasksToStorage(tasks);
  }, [tasks]);

  useEffect(() => {
    saveSettingsToStorage(settings);
  }, [settings]);

  useEffect(() => {
    saveUserToStorage(currentUser);
  }, [currentUser]);

  // Auth Handlers
  const handleLogin = useCallback((user: User) => {
    setCurrentUser(user);
    setCurrentView('tasks');
  }, []);

  const handleLogout = useCallback(() => {
    setCurrentUser(null);
    saveUserToStorage(null);
  }, []);

  const handleContinueAsGuest = useCallback(() => {
    setCurrentView('tasks');
  }, []);

  const handleOpenLogin = useCallback(() => {
    setCurrentView('login');
  }, []);

  // Handlers
  const handleAddTask = useCallback(
    (title: string, bucket: Bucket, priority?: Priority) => {
      const newTask: Task = {
        id: 'task-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
        title,
        completed: false,
        bucket,
        priority,
        createdAt: Date.now(),
      };
      setTasks((prev) => [newTask, ...prev]);
      if (settings.soundEnabled) {
        playAddSound();
      }
    },
    [settings.soundEnabled]
  );

  const handleToggleComplete = useCallback(
    (id: string) => {
      setTasks((prev) =>
        prev.map((t) => {
          if (t.id === id) {
            const nextCompleted = !t.completed;
            if (nextCompleted && settings.soundEnabled) {
              playCompleteSound();
            }
            return {
              ...t,
              completed: nextCompleted,
              completedAt: nextCompleted ? Date.now() : undefined,
            };
          }
          return t;
        })
      );
    },
    [settings.soundEnabled]
  );

  const handleDeleteTask = useCallback(
    (id: string) => {
      setTasks((prev) => prev.filter((t) => t.id !== id));
      if (settings.soundEnabled) {
        playDeleteSound();
      }
    },
    [settings.soundEnabled]
  );

  const handleEditTitle = useCallback((id: string, newTitle: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, title: newTitle } : t))
    );
  }, []);

  const handleChangeBucket = useCallback((id: string, newBucket: Bucket) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, bucket: newBucket } : t))
    );
  }, []);

  const handleClearCompletedInCurrentBucket = useCallback(() => {
    setTasks((prev) => prev.filter((t) => !(t.bucket === activeBucket && t.completed)));
  }, [activeBucket]);

  const handleClearAllCompleted = useCallback(() => {
    setTasks((prev) => prev.filter((t) => !t.completed));
  }, []);

  const handleResetSampleTasks = useCallback(() => {
    setTasks(INITIAL_TASKS);
    setIsSettingsOpen(false);
  }, []);

  const handleUpdateSettings = useCallback((newSettings: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  }, []);

  // Compute counts for today & upcoming
  const todayTasks = useMemo(() => tasks.filter((t) => t.bucket === 'today'), [tasks]);
  const upcomingTasks = useMemo(() => tasks.filter((t) => t.bucket === 'upcoming'), [tasks]);

  const todayCount = useMemo(
    () => ({
      total: todayTasks.length,
      active: todayTasks.filter((t) => !t.completed).length,
      completed: todayTasks.filter((t) => t.completed).length,
    }),
    [todayTasks]
  );

  const upcomingCount = useMemo(
    () => ({
      total: upcomingTasks.length,
      active: upcomingTasks.filter((t) => !t.completed).length,
      completed: upcomingTasks.filter((t) => t.completed).length,
    }),
    [upcomingTasks]
  );

  // Filter and sort items to display
  const displayedTasks = useMemo(() => {
    let list = tasks.filter((t) => t.bucket === activeBucket);

    // Apply status filter
    if (activeFilter === 'active') {
      list = list.filter((t) => !t.completed);
    } else if (activeFilter === 'completed') {
      list = list.filter((t) => t.completed);
    }

    // Apply search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((t) => t.title.toLowerCase().includes(q));
    }

    // Apply auto-sort: active first, then completed at bottom
    if (settings.autoSortCompletedToBottom && activeFilter === 'all') {
      list = [...list].sort((a, b) => {
        if (a.completed === b.completed) {
          return b.createdAt - a.createdAt;
        }
        return a.completed ? 1 : -1;
      });
    }

    return list;
  }, [tasks, activeBucket, activeFilter, searchQuery, settings.autoSortCompletedToBottom]);

  const currentBucketStats = activeBucket === 'today' ? todayCount : upcomingCount;

  // Render Login view if requested
  if (currentView === 'login') {
    return (
      <LoginPage
        onLogin={handleLogin}
        onContinueAsGuest={handleContinueAsGuest}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F7F4] text-[#1A1A1A] px-4 sm:px-6 lg:px-8 py-4 sm:py-8 flex flex-col justify-between selection:bg-[#2F4A3D]/15 selection:text-[#1A1A1A]">
      <div className="w-full max-w-2xl mx-auto flex-1">
        {/* 1. Header */}
        <Header
          onOpenSettings={() => setIsSettingsOpen(true)}
          completedTodayCount={todayCount.completed}
          totalTodayCount={todayCount.total}
          currentUser={currentUser}
          onOpenLogin={handleOpenLogin}
          onLogout={handleLogout}
        />

        {/* 2. Progress Section */}
        <ProgressSection
          completedCount={currentBucketStats.completed}
          totalCount={currentBucketStats.total}
          currentBucket={activeBucket}
        />

        {/* 3. Add Task Section */}
        <AddTaskForm onAddTask={handleAddTask} activeBucket={activeBucket} />

        {/* 4. Task Filters */}
        <TaskFilters
          activeBucket={activeBucket}
          onChangeBucket={setActiveBucket}
          todayCount={todayCount}
          upcomingCount={upcomingCount}
          activeFilter={activeFilter}
          onChangeFilter={setActiveFilter}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onClearCompleted={handleClearCompletedInCurrentBucket}
          hasCompletedInCurrentBucket={currentBucketStats.completed > 0}
        />

        {/* 5. Task List / 6. Empty State */}
        <TaskList
          tasks={displayedTasks}
          onToggleComplete={handleToggleComplete}
          onDelete={handleDeleteTask}
          onEditTitle={handleEditTitle}
          onChangeBucket={handleChangeBucket}
          activeFilter={activeFilter}
          activeBucket={activeBucket}
          searchQuery={searchQuery}
        />
      </div>

      {/* Footer metadata */}
      <footer className="w-full max-w-2xl mx-auto mt-12 pt-6 border-t border-[#EAE8E3] text-center text-xs text-[#8E8B83] flex items-center justify-between">
        <span>Press <kbd className="px-1.5 py-0.5 rounded bg-[#EAE8E3] text-[#1A1A1A] font-mono text-[10px]">Enter</kbd> to add task</span>
        <span>Minimal & Calm Productivity</span>
      </footer>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        tasks={tasks}
        onResetTasks={handleResetSampleTasks}
        onClearAllCompleted={handleClearAllCompleted}
        currentUser={currentUser}
        onOpenLogin={handleOpenLogin}
        onLogout={handleLogout}
      />
    </div>
  );
}

