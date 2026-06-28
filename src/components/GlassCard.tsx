import React from 'react';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  glowColor?: 'indigo' | 'purple' | 'emerald' | 'amber' | 'sky' | 'rose' | 'none';
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  hoverEffect = false,
  glowColor = 'none',
  ...props
}) => {
  const glowStyles = {
    indigo: 'hover:shadow-indigo-500/10 border-indigo-500/20',
    purple: 'hover:shadow-purple-500/10 border-purple-500/20',
    emerald: 'hover:shadow-emerald-500/10 border-emerald-500/20',
    amber: 'hover:shadow-amber-500/10 border-amber-500/20',
    sky: 'hover:shadow-sky-500/10 border-sky-500/20',
    rose: 'hover:shadow-rose-500/10 border-rose-500/20',
    none: 'border-slate-200/80 dark:border-slate-800/80',
  };

  return (
    <div
      className={`backdrop-blur-xl bg-white/70 dark:bg-slate-900/60 rounded-3xl p-6 sm:p-8 border shadow-xl shadow-slate-200/40 dark:shadow-none transition-all duration-300 ${
        hoverEffect ? 'hover:-translate-y-1 hover:shadow-2xl' : ''
      } ${glowStyles[glowColor]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
