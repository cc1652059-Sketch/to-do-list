import { useState, useRef, FormEvent } from 'react';
import { Plus, Flag, CalendarDays } from 'lucide-react';
import { Priority, Bucket } from '../types';

interface AddTaskFormProps {
  onAddTask: (title: string, bucket: Bucket, priority?: Priority) => void;
  activeBucket: Bucket;
}

export function AddTaskForm({ onAddTask, activeBucket }: AddTaskFormProps) {
  const [title, setTitle] = useState('');
  const [bucket, setBucket] = useState<Bucket>(activeBucket);
  const [priority, setPriority] = useState<Priority | undefined>(undefined);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync bucket state when activeBucket changes from outside if input is clean
  // But allow user to override
  const handleBucketToggle = (b: Bucket) => {
    setBucket(b);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddTask(title.trim(), bucket, priority);
    setTitle('');
    setPriority(undefined);
    // Keep focus for rapid additions
    inputRef.current?.focus();
  };

  return (
    <form
      id="add-task-form"
      onSubmit={handleSubmit}
      className={`mt-6 rounded-2xl bg-white p-3.5 sm:p-4 border transition-all duration-200 shadow-xs ${
        isFocused
          ? 'border-[#2F4A3D]/50 ring-2 ring-[#2F4A3D]/10'
          : 'border-[#E2DFD7] hover:border-[#D8D5CC]'
      }`}
    >
      <div className="flex items-center gap-3">
        <input
          id="task-title-input"
          ref={inputRef}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Add a new task... (Press Enter to add)"
          className="flex-1 text-sm sm:text-base placeholder:text-[#8E8B83] text-[#1A1A1A] bg-transparent focus:outline-none"
        />

        <button
          id="submit-add-task-btn"
          type="submit"
          disabled={!title.trim()}
          className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl bg-[#2F4A3D] text-white text-xs sm:text-sm font-medium hover:bg-[#253B30] active:scale-[0.98] transition-all disabled:opacity-40 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-[#2F4A3D]/40"
        >
          <Plus className="w-4 h-4 stroke-[2.2]" />
          <span className="hidden sm:inline">Add Task</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>

      {/* Auxiliary quick controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-3 border-t border-[#F2F0EB]">
        {/* Bucket selector */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-medium text-[#8E8B83] flex items-center gap-1">
            <CalendarDays className="w-3 h-3" /> List:
          </span>
          <div className="inline-flex p-0.5 rounded-lg bg-[#EAE8E3]/60 border border-[#E2DFD7]">
            <button
              type="button"
              id="bucket-select-today-btn"
              onClick={() => handleBucketToggle('today')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                bucket === 'today'
                  ? 'bg-white text-[#1A1A1A] shadow-xs'
                  : 'text-[#73716B] hover:text-[#1A1A1A]'
              }`}
            >
              Today
            </button>
            <button
              type="button"
              id="bucket-select-upcoming-btn"
              onClick={() => handleBucketToggle('upcoming')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                bucket === 'upcoming'
                  ? 'bg-white text-[#1A1A1A] shadow-xs'
                  : 'text-[#73716B] hover:text-[#1A1A1A]'
              }`}
            >
              Upcoming
            </button>
          </div>
        </div>

        {/* Priority selector */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-medium text-[#8E8B83] flex items-center gap-1">
            <Flag className="w-3 h-3" /> Priority:
          </span>
          <div className="inline-flex gap-1">
            {(['low', 'medium', 'high'] as Priority[]).map((p) => {
              const isSelected = priority === p;
              const label = p.charAt(0).toUpperCase() + p.slice(1);
              return (
                <button
                  key={p}
                  type="button"
                  id={`priority-toggle-${p}-btn`}
                  onClick={() => setPriority(isSelected ? undefined : p)}
                  className={`px-2 py-0.5 text-xs rounded-md border transition-all ${
                    isSelected
                      ? p === 'high'
                        ? 'bg-[#EAE8E3] border-[#73716B] text-[#1A1A1A] font-semibold'
                        : p === 'medium'
                        ? 'bg-[#EAE8E3] border-[#73716B] text-[#1A1A1A] font-semibold'
                        : 'bg-[#EAE8E3] border-[#73716B] text-[#1A1A1A] font-semibold'
                      : 'bg-transparent border-transparent text-[#73716B] hover:bg-[#F2F0EB]'
                  }`}
                >
                  <span
                    className={`inline-block w-1.5 h-1.5 rounded-full mr-1 ${
                      p === 'high'
                        ? 'bg-[#9C413D]'
                        : p === 'medium'
                        ? 'bg-[#C27D38]'
                        : 'bg-[#5B7E6F]'
                    }`}
                  />
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </form>
  );
}
