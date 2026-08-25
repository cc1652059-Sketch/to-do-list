import { motion } from 'motion/react';
import { Search, X, CheckCheck } from 'lucide-react';
import { Bucket, FilterStatus } from '../types';

interface TaskFiltersProps {
  activeBucket: Bucket;
  onChangeBucket: (bucket: Bucket) => void;
  todayCount: { total: number; active: number; completed: number };
  upcomingCount: { total: number; active: number; completed: number };
  activeFilter: FilterStatus;
  onChangeFilter: (filter: FilterStatus) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onClearCompleted?: () => void;
  hasCompletedInCurrentBucket: boolean;
}

export function TaskFilters({
  activeBucket,
  onChangeBucket,
  todayCount,
  upcomingCount,
  activeFilter,
  onChangeFilter,
  searchQuery,
  onSearchChange,
  onClearCompleted,
  hasCompletedInCurrentBucket,
}: TaskFiltersProps) {
  const filterOptions: { id: FilterStatus; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'active', label: 'Active' },
    { id: 'completed', label: 'Completed' },
  ];

  return (
    <div className="mt-8 space-y-4">
      {/* Primary bucket navigation (Today vs Upcoming) */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E2DFD7] pb-3">
        <div className="flex items-center gap-2">
          {/* Today tab */}
          <button
            id="tab-today-btn"
            onClick={() => onChangeBucket('today')}
            className={`relative pb-2 text-sm sm:text-base font-semibold transition-colors ${
              activeBucket === 'today'
                ? 'text-[#1A1A1A]'
                : 'text-[#8E8B83] hover:text-[#1A1A1A]'
            }`}
          >
            <span className="flex items-center gap-1.5">
              Today
              <span
                className={`text-xs px-2 py-0.5 rounded-full transition-colors ${
                  activeBucket === 'today'
                    ? 'bg-[#2F4A3D] text-white'
                    : 'bg-[#EAE8E3] text-[#73716B]'
                }`}
              >
                {todayCount.active}
              </span>
            </span>
            {activeBucket === 'today' && (
              <motion.div
                layoutId="bucketUnderline"
                className="absolute -bottom-[13px] left-0 right-0 h-0.5 bg-[#2F4A3D] rounded-full"
                transition={{ type: 'spring', stiffness: 450, damping: 35 }}
              />
            )}
          </button>

          <span className="text-[#D8D5CC] px-1 font-light">/</span>

          {/* Upcoming tab */}
          <button
            id="tab-upcoming-btn"
            onClick={() => onChangeBucket('upcoming')}
            className={`relative pb-2 text-sm sm:text-base font-semibold transition-colors ${
              activeBucket === 'upcoming'
                ? 'text-[#1A1A1A]'
                : 'text-[#8E8B83] hover:text-[#1A1A1A]'
            }`}
          >
            <span className="flex items-center gap-1.5">
              Upcoming
              <span
                className={`text-xs px-2 py-0.5 rounded-full transition-colors ${
                  activeBucket === 'upcoming'
                    ? 'bg-[#2F4A3D] text-white'
                    : 'bg-[#EAE8E3] text-[#73716B]'
                }`}
              >
                {upcomingCount.active}
              </span>
            </span>
            {activeBucket === 'upcoming' && (
              <motion.div
                layoutId="bucketUnderline"
                className="absolute -bottom-[13px] left-0 right-0 h-0.5 bg-[#2F4A3D] rounded-full"
                transition={{ type: 'spring', stiffness: 450, damping: 35 }}
              />
            )}
          </button>
        </div>

        {/* Search box */}
        <div className="relative flex-1 max-w-[200px] sm:max-w-[240px]">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8E8B83]" />
          <input
            id="filter-search-input"
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-8 pr-7 py-1.5 text-xs rounded-xl bg-white border border-[#E2DFD7] text-[#1A1A1A] placeholder:text-[#8E8B83] focus:outline-none focus:border-[#2F4A3D] focus:ring-1 focus:ring-[#2F4A3D]/30 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-[#8E8B83] hover:text-[#1A1A1A]"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Secondary filter pill row: All, Active, Completed */}
      <div className="flex items-center justify-between gap-2 pt-1">
        <div className="inline-flex p-1 rounded-xl bg-[#EAE8E3]/70 border border-[#E2DFD7]/80">
          {filterOptions.map((opt) => {
            const isSelected = activeFilter === opt.id;
            return (
              <button
                key={opt.id}
                id={`filter-${opt.id}-btn`}
                onClick={() => onChangeFilter(opt.id)}
                className={`relative px-3 py-1 text-xs font-medium rounded-lg transition-colors z-10 ${
                  isSelected ? 'text-[#1A1A1A] font-semibold' : 'text-[#73716B] hover:text-[#1A1A1A]'
                }`}
              >
                {opt.label}
                {isSelected && (
                  <motion.div
                    layoutId="filterPillIndicator"
                    className="absolute inset-0 bg-white rounded-lg shadow-xs -z-10"
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Clear completed shortcut if any */}
        {hasCompletedInCurrentBucket && onClearCompleted && (
          <button
            id="clear-completed-btn"
            onClick={onClearCompleted}
            className="text-xs font-medium text-[#73716B] hover:text-[#9C413D] transition-colors flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-[#EAE8E3]/50"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear completed</span>
            <span className="sm:hidden">Clear</span>
          </button>
        )}
      </div>
    </div>
  );
}
