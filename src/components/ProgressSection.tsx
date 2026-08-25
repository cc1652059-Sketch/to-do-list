import { motion } from 'motion/react';
import { Sparkles, CheckCheck } from 'lucide-react';

interface ProgressSectionProps {
  completedCount: number;
  totalCount: number;
  currentBucket: 'today' | 'upcoming';
}

export function ProgressSection({
  completedCount,
  totalCount,
  currentBucket,
}: ProgressSectionProps) {
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const remaining = totalCount - completedCount;

  return (
    <section 
      id="progress-section"
      className="mt-6 p-4 sm:p-5 rounded-2xl bg-[#EAE8E3]/60 border border-[#E2DFD7] transition-all"
    >
      <div className="flex items-center justify-between gap-4 mb-2.5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-[#1A1A1A]">
              {completedCount} of {totalCount} tasks completed
            </span>
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[#2F4A3D]/10 text-[#2F4A3D]">
              {percentage}%
            </span>
          </div>
          <p className="text-xs text-[#73716B] mt-0.5">
            {totalCount === 0 ? (
              'No tasks scheduled yet'
            ) : remaining === 0 ? (
              <span className="inline-flex items-center gap-1 text-[#2F4A3D] font-medium">
                <CheckCheck className="w-3.5 h-3.5 inline" /> Everything completed in {currentBucket}!
              </span>
            ) : (
              <span className="inline-flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#2F4A3D]" /> {remaining} task{remaining === 1 ? '' : 's'} left for {currentBucket}
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Progress track */}
      <div className="w-full h-2 bg-[#DCD9D1] rounded-full overflow-hidden relative">
        <motion.div
          className="h-full bg-[#2F4A3D] rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
        />
      </div>
    </section>
  );
}
