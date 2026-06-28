import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => {
  return (
    <div
      className={`animate-pulse rounded-xl bg-slate-200/80 dark:bg-slate-800/80 transition-all duration-300 ${className}`}
    />
  );
};

export const SkeletonCard: React.FC = () => {
  return (
    <div className="p-6 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/60 dark:border-slate-800/60 space-y-4 backdrop-blur-xl shadow-sm">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-8 rounded-lg" />
      </div>
      <Skeleton className="h-8 w-36 mt-2" />
      <Skeleton className="h-3 w-48 mt-1" />
    </div>
  );
};

export const SkeletonChart: React.FC<{ height?: string }> = ({ height = 'h-[300px]' }) => {
  return (
    <div className="p-6 sm:p-8 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/60 dark:border-slate-800/60 space-y-6 backdrop-blur-xl shadow-sm">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-3 w-64" />
        </div>
        <Skeleton className="h-8 w-24 rounded-lg" />
      </div>
      <div className={`w-full ${height} flex items-end justify-between gap-3 pt-6`}>
        <Skeleton className="h-[40%] w-full rounded-t-lg" />
        <Skeleton className="h-[75%] w-full rounded-t-lg" />
        <Skeleton className="h-[60%] w-full rounded-t-lg" />
        <Skeleton className="h-[90%] w-full rounded-t-lg" />
        <Skeleton className="h-[50%] w-full rounded-t-lg" />
        <Skeleton className="h-[85%] w-full rounded-t-lg" />
      </div>
    </div>
  );
};

export const SkeletonList: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="p-5 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/60 dark:border-slate-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 backdrop-blur-xl shadow-sm">
          <div className="space-y-2.5 flex-1">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-16 rounded-md" />
              <Skeleton className="h-5 w-44" />
            </div>
            <Skeleton className="h-3.5 w-full max-w-xl" />
            <Skeleton className="h-3 w-64" />
          </div>
          <div className="flex sm:flex-col items-end justify-between gap-2 shrink-0">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
      ))}
    </div>
  );
};
