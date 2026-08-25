import { motion, AnimatePresence } from 'motion/react';
import { X, Volume2, VolumeX, ArrowDownNarrowWide, RotateCcw, CheckSquare, Sparkles, User as UserIcon, LogOut, LogIn } from 'lucide-react';
import { AppSettings, Task, User } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  tasks: Task[];
  onResetTasks: () => void;
  onClearAllCompleted: () => void;
  currentUser: User | null;
  onOpenLogin: () => void;
  onLogout: () => void;
}

export function SettingsModal({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  tasks,
  onResetTasks,
  onClearAllCompleted,
  currentUser,
  onOpenLogin,
  onLogout,
}: SettingsModalProps) {
  if (!isOpen) return null;

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#1A1A1A]/30 backdrop-blur-xs"
        />

        {/* Modal content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 8 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-md bg-[#F8F7F4] border border-[#D8D5CC] rounded-2xl shadow-xl overflow-hidden z-10"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[#EAE8E3]">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#2F4A3D]" />
              <h2 className="text-base font-bold text-[#1A1A1A]">Preferences & Settings</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#8E8B83] hover:text-[#1A1A1A] hover:bg-[#EAE8E3] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 sm:p-5 space-y-5 max-h-[80vh] overflow-y-auto">
            {/* User Account Info */}
            <div className="p-3.5 rounded-xl bg-white border border-[#E2DFD7] flex items-center justify-between">
              {currentUser ? (
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#2F4A3D] text-white flex items-center justify-center font-bold text-sm">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-[#1A1A1A]">{currentUser.name}</div>
                    <div className="text-xs text-[#8E8B83]">{currentUser.email}</div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#EAE8E3] text-[#73716B] flex items-center justify-center">
                    <UserIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-[#1A1A1A]">Guest Mode</div>
                    <div className="text-xs text-[#8E8B83]">Sign in to sync your tasks</div>
                  </div>
                </div>
              )}

              {currentUser ? (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onLogout();
                  }}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#9C413D] hover:bg-[#FBE8E7] transition-colors flex items-center gap-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenLogin();
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-[#2F4A3D] hover:bg-[#253B30] transition-colors flex items-center gap-1"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  Sign In
                </button>
              )}
            </div>

            {/* Quick stats panel */}
            <div className="grid grid-cols-3 gap-2 text-center p-3 rounded-xl bg-white border border-[#E2DFD7]">
              <div>
                <div className="text-xl font-bold text-[#1A1A1A]">{totalTasks}</div>
                <div className="text-[11px] text-[#8E8B83] uppercase tracking-wider font-medium mt-0.5">Total</div>
              </div>
              <div className="border-x border-[#EAE8E3]">
                <div className="text-xl font-bold text-[#2F4A3D]">{completedTasks}</div>
                <div className="text-[11px] text-[#8E8B83] uppercase tracking-wider font-medium mt-0.5">Completed</div>
              </div>
              <div>
                <div className="text-xl font-bold text-[#1A1A1A]">{completionRate}%</div>
                <div className="text-[11px] text-[#8E8B83] uppercase tracking-wider font-medium mt-0.5">Rate</div>
              </div>
            </div>

            {/* Toggle settings */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#8E8B83]">
                Preferences
              </h3>

              {/* Sound toggle */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-[#E2DFD7]">
                <div className="flex items-center gap-2.5">
                  {settings.soundEnabled ? (
                    <Volume2 className="w-4 h-4 text-[#2F4A3D]" />
                  ) : (
                    <VolumeX className="w-4 h-4 text-[#8E8B83]" />
                  )}
                  <div>
                    <div className="text-xs sm:text-sm font-medium text-[#1A1A1A]">Subtle Chime Audio</div>
                    <div className="text-[11px] text-[#8E8B83]">Play gentle sound on completion</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onUpdateSettings({ soundEnabled: !settings.soundEnabled })}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    settings.soundEnabled ? 'bg-[#2F4A3D]' : 'bg-[#D8D5CC]'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      settings.soundEnabled ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Auto sort completed to bottom */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-[#E2DFD7]">
                <div className="flex items-center gap-2.5">
                  <ArrowDownNarrowWide className="w-4 h-4 text-[#2F4A3D]" />
                  <div>
                    <div className="text-xs sm:text-sm font-medium text-[#1A1A1A]">Move Completed to Bottom</div>
                    <div className="text-[11px] text-[#8E8B83]">Keep active priorities prominent</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    onUpdateSettings({
                      autoSortCompletedToBottom: !settings.autoSortCompletedToBottom,
                    })
                  }
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    settings.autoSortCompletedToBottom ? 'bg-[#2F4A3D]' : 'bg-[#D8D5CC]'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      settings.autoSortCompletedToBottom ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-2 border-t border-[#EAE8E3]">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#8E8B83]">
                Manage Data
              </h3>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onClearAllCompleted();
                  }}
                  disabled={completedTasks === 0}
                  className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl text-xs font-medium bg-white border border-[#E2DFD7] text-[#73716B] hover:text-[#9C413D] hover:border-[#F4C8C5] hover:bg-[#FBE8E7]/40 disabled:opacity-40 disabled:pointer-events-none transition-colors"
                >
                  <CheckSquare className="w-3.5 h-3.5" />
                  Clear Completed
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onResetTasks();
                  }}
                  className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl text-xs font-medium bg-white border border-[#E2DFD7] text-[#73716B] hover:text-[#1A1A1A] hover:bg-[#EAE8E3] transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset Sample Tasks
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

