import { useState, useEffect } from 'react';
import { SlidersHorizontal, CheckCircle2, User as UserIcon, LogOut, LogIn } from 'lucide-react';
import { User } from '../types';

interface HeaderProps {
  onOpenSettings: () => void;
  completedTodayCount: number;
  totalTodayCount: number;
  currentUser: User | null;
  onOpenLogin: () => void;
  onLogout: () => void;
}

export function Header({
  onOpenSettings,
  completedTodayCount,
  totalTodayCount,
  currentUser,
  onOpenLogin,
  onLogout,
}: HeaderProps) {
  const [currentDateStr, setCurrentDateStr] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    });
    setCurrentDateStr(formatter.format(now));
  }, []);

  const isAllTodayDone = totalTodayCount > 0 && completedTodayCount === totalTodayCount;

  return (
    <header className="pt-8 pb-6 flex items-start justify-between border-b border-[#EAE8E3]/80">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#73716B]">
            {currentDateStr || 'Today'}
          </p>
          {isAllTodayDone && (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-[#2F4A3D]/10 text-[#2F4A3D] px-2 py-0.5 rounded-full">
              <CheckCircle2 className="w-3 h-3" />
              All caught up
            </span>
          )}
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#1A1A1A]">
          My Tasks
        </h1>
      </div>

      <div className="flex items-center gap-2">
        {/* User Account Button */}
        {currentUser ? (
          <div className="relative">
            <button
              id="user-profile-btn"
              onClick={() => setShowUserMenu(!showUserMenu)}
              title={`Logged in as ${currentUser.name}`}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs font-medium text-[#1A1A1A] bg-[#EAE8E3]/70 hover:bg-[#EAE8E3] border border-[#E2DFD7] active:scale-95 transition-all"
            >
              <div className="w-5 h-5 rounded-full bg-[#2F4A3D] text-white flex items-center justify-center text-[10px] font-bold">
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
              <span className="hidden sm:inline max-w-[100px] truncate">{currentUser.name}</span>
            </button>

            {showUserMenu && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setShowUserMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-white border border-[#D8D5CC] rounded-xl shadow-lg p-2 z-30 space-y-1">
                  <div className="px-2 py-1.5 border-b border-[#F2F0EB]">
                    <div className="text-xs font-bold text-[#1A1A1A] truncate">{currentUser.name}</div>
                    <div className="text-[10px] text-[#8E8B83] truncate">{currentUser.email}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setShowUserMenu(false);
                      onOpenLogin();
                    }}
                    className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-[#1A1A1A] hover:bg-[#EAE8E3] rounded-lg transition-colors"
                  >
                    <UserIcon className="w-3.5 h-3.5 text-[#73716B]" />
                    <span>Switch Account</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowUserMenu(false);
                      onLogout();
                    }}
                    className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-[#9C413D] hover:bg-[#FBE8E7] rounded-lg transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <button
            id="header-login-btn"
            onClick={onOpenLogin}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-[#2F4A3D] bg-[#2F4A3D]/10 hover:bg-[#2F4A3D]/15 border border-[#2F4A3D]/20 active:scale-95 transition-all"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
        )}

        {/* Settings button */}
        <button
          id="settings-trigger-btn"
          onClick={onOpenSettings}
          title="Preferences & Options"
          className="p-2.5 rounded-xl text-[#73716B] hover:text-[#1A1A1A] hover:bg-[#EAE8E3] active:scale-95 transition-all duration-150 border border-transparent hover:border-[#D8D5CC]/60 focus:outline-none focus:ring-2 focus:ring-[#2F4A3D]/30"
          aria-label="Settings"
        >
          <SlidersHorizontal className="w-5 h-5 stroke-[1.75]" />
        </button>
      </div>
    </header>
  );
}

