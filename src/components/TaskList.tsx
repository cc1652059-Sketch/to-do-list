import { AnimatePresence } from 'motion/react';
import { Task, Bucket, FilterStatus } from '../types';
import { TaskItem } from './TaskItem';
import { EmptyState } from './EmptyState';

interface TaskListProps {
  tasks: Task[];
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onEditTitle: (id: string, newTitle: string) => void;
  onChangeBucket: (id: string, newBucket: Bucket) => void;
  activeFilter: FilterStatus;
  activeBucket: Bucket;
  searchQuery: string;
}

export function TaskList({
  tasks,
  onToggleComplete,
  onDelete,
  onEditTitle,
  onChangeBucket,
  activeFilter,
  activeBucket,
  searchQuery,
}: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="mt-4">
        <EmptyState
          filter={activeFilter}
          bucket={activeBucket}
          hasSearchQuery={Boolean(searchQuery)}
        />
      </div>
    );
  }

  return (
    <div className="mt-4">
      <ul id="task-items-list" className="space-y-2.5">
        <AnimatePresence mode="popLayout" initial={false}>
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggleComplete={onToggleComplete}
              onDelete={onDelete}
              onEditTitle={onEditTitle}
              onChangeBucket={onChangeBucket}
            />
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}
