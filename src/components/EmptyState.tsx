import { CheckCircle2, ListFilter, PlusCircle, Search } from 'lucide-react';
import { FilterStatus, Bucket } from '../types';

interface EmptyStateProps {
  filter: FilterStatus;
  bucket: Bucket;
  hasSearchQuery: boolean;
  onQuickAdd?: () => void;
}

export function EmptyState({
  filter,
  bucket,
  hasSearchQuery,
}: EmptyStateProps) {
  if (hasSearchQuery) {
    return (
      <div className="py-12 px-4 text-center rounded-2xl bg-white/50 border border-dashed border-[#D8D5CC]">
        <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-[#EAE8E3] flex items-center justify-center text-[#73716B]">
          <Search className="w-5 h-5" />
        </div>
        <h3 className="text-sm font-semibold text-[#1A1A1A]">No matching tasks</h3>
        <p className="text-xs text-[#8E8B83] mt-1 max-w-xs mx-auto">
          We couldn't find any tasks matching your search query. Try another keyword.
        </p>
      </div>
    );
  }

  if (filter === 'completed') {
    return (
      <div className="py-12 px-4 text-center rounded-2xl bg-white/50 border border-dashed border-[#D8D5CC]">
        <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-[#EAE8E3] flex items-center justify-center text-[#73716B]">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <h3 className="text-sm font-semibold text-[#1A1A1A]">No completed tasks yet</h3>
        <p className="text-xs text-[#8E8B83] mt-1 max-w-xs mx-auto">
          Check off tasks as you finish them to see your completed archive here.
        </p>
      </div>
    );
  }

  if (filter === 'active') {
    return (
      <div className="py-12 px-4 text-center rounded-2xl bg-white/50 border border-dashed border-[#D8D5CC]">
        <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-[#2F4A3D]/10 flex items-center justify-center text-[#2F4A3D]">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <h3 className="text-sm font-semibold text-[#1A1A1A]">All caught up!</h3>
        <p className="text-xs text-[#8E8B83] mt-1 max-w-xs mx-auto">
          You have no active tasks left in {bucket}. Enjoy your free time or add a new goal.
        </p>
      </div>
    );
  }

  return (
    <div className="py-14 px-4 text-center rounded-2xl bg-white/50 border border-dashed border-[#D8D5CC]">
      <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-[#EAE8E3] flex items-center justify-center text-[#73716B]">
        {bucket === 'today' ? (
          <PlusCircle className="w-5 h-5 text-[#2F4A3D]" />
        ) : (
          <ListFilter className="w-5 h-5 text-[#73716B]" />
        )}
      </div>
      <h3 className="text-sm font-semibold text-[#1A1A1A]">
        {bucket === 'today' ? 'Your day is clear' : 'No upcoming tasks scheduled'}
      </h3>
      <p className="text-xs text-[#8E8B83] mt-1 max-w-xs mx-auto">
        {bucket === 'today'
          ? 'Add your most important priorities for today using the input above.'
          : 'Plan ahead by creating tasks for upcoming days and projects.'}
      </p>
    </div>
  );
}
