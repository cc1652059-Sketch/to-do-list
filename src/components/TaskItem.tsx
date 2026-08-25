import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { motion } from 'motion/react';
import { Check, Trash2, Edit2, ArrowRightLeft } from 'lucide-react';
import { Task, Priority, Bucket } from '../types';

interface TaskItemProps {
  key?: string;
  task: Task;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onEditTitle: (id: string, newTitle: string) => void;
  onChangeBucket: (id: string, newBucket: Bucket) => void;
}

export function TaskItem({
  task,
  onToggleComplete,
  onDelete,
  onEditTitle,
  onChangeBucket,
}: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(task.title);
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      editInputRef.current?.focus();
      editInputRef.current?.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    if (editValue.trim() && editValue.trim() !== task.title) {
      onEditTitle(task.id, editValue.trim());
    } else {
      setEditValue(task.title);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setEditValue(task.title);
      setIsEditing(false);
    }
  };

  const priorityBadge = (priority?: Priority) => {
    if (!priority) return null;
    const config = {
      high: {
        bg: 'bg-[#FBE8E7]',
        text: 'text-[#9C413D]',
        border: 'border-[#F4C8C5]',
        dot: 'bg-[#9C413D]',
        label: 'High',
      },
      medium: {
        bg: 'bg-[#FEF3E6]',
        text: 'text-[#C27D38]',
        border: 'border-[#F7DEB8]',
        dot: 'bg-[#C27D38]',
        label: 'Medium',
      },
      low: {
        bg: 'bg-[#EBF2EE]',
        text: 'text-[#3E6554]',
        border: 'border-[#CEE0D7]',
        dot: 'bg-[#3E6554]',
        label: 'Low',
      },
    }[priority];

    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium rounded-md border ${config.bg} ${config.text} ${config.border}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
        {config.label}
      </span>
    );
  };

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
      transition={{ duration: 0.2 }}
      className={`group relative flex items-start gap-3 p-3.5 sm:p-4 rounded-xl bg-white border transition-all duration-150 shadow-xs ${
        task.completed
          ? 'border-[#EAE8E3] bg-white/60 opacity-70'
          : 'border-[#E2DFD7] hover:border-[#D0CCC1] hover:shadow-sm'
      }`}
    >
      {/* Custom Checkbox */}
      <button
        id={`task-check-${task.id}`}
        type="button"
        onClick={() => onToggleComplete(task.id)}
        aria-label={task.completed ? 'Mark task incomplete' : 'Mark task complete'}
        className={`mt-0.5 shrink-0 w-5 h-5 rounded-md flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#2F4A3D]/40 ${
          task.completed
            ? 'bg-[#2F4A3D] text-white border border-[#2F4A3D]'
            : 'border-2 border-[#BEB9AC] hover:border-[#2F4A3D] bg-transparent'
        }`}
      >
        {task.completed && (
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 28 }}
          >
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          </motion.div>
        )}
      </button>

      {/* Title / Edit field */}
      <div className="flex-1 min-w-0 pr-2">
        {isEditing ? (
          <div className="flex items-center gap-2">
            <input
              ref={editInputRef}
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleSave}
              onKeyDown={handleKeyDown}
              className="w-full text-sm sm:text-base font-normal text-[#1A1A1A] bg-[#F8F7F4] px-2 py-0.5 rounded border border-[#2F4A3D] focus:outline-none"
            />
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            <span
              onClick={() => setIsEditing(true)}
              className={`text-sm sm:text-base font-normal break-words cursor-pointer select-none transition-all ${
                task.completed
                  ? 'line-through text-[#8E8B83]'
                  : 'text-[#1A1A1A] hover:text-[#2F4A3D]'
              }`}
            >
              {task.title}
            </span>

            {/* Badges / metadata */}
            <div className="flex flex-wrap items-center gap-2 mt-0.5">
              {priorityBadge(task.priority)}

              {task.dueDate && (
                <span className="text-[11px] text-[#8E8B83] bg-[#EAE8E3]/60 px-1.5 py-0.5 rounded">
                  {task.dueDate}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons (subtle on hover on desktop, always accessible on touch) */}
      <div className="shrink-0 flex items-center gap-1 opacity-80 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-within:opacity-100 transition-opacity">
        {/* Toggle bucket (Move between Today and Upcoming) */}
        <button
          type="button"
          onClick={() => onChangeBucket(task.id, task.bucket === 'today' ? 'upcoming' : 'today')}
          title={task.bucket === 'today' ? 'Move to Upcoming' : 'Move to Today'}
          className="p-1.5 rounded-lg text-[#8E8B83] hover:text-[#1A1A1A] hover:bg-[#EAE8E3] active:scale-95 transition-all"
        >
          <ArrowRightLeft className="w-3.5 h-3.5" />
        </button>

        {/* Edit Title */}
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          title="Edit task"
          className="p-1.5 rounded-lg text-[#8E8B83] hover:text-[#1A1A1A] hover:bg-[#EAE8E3] active:scale-95 transition-all"
        >
          <Edit2 className="w-3.5 h-3.5" />
        </button>

        {/* Delete */}
        <button
          type="button"
          onClick={() => onDelete(task.id)}
          title="Delete task"
          className="p-1.5 rounded-lg text-[#8E8B83] hover:text-[#9C413D] hover:bg-[#FBE8E7] active:scale-95 transition-all"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.li>
  );
}
