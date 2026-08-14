import { cn } from '@/lib/utils';

import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  color?: 'blue' | 'green' | 'red' | 'amber' | 'cyan' | 'violet' | 'emerald' | 'orange' | 'pink' | 'indigo';
  className?: string;
  progressPercent?: number;
  progressColor?: string;
}

const colorMap: Record<string, { bg: string; icon: string; progress: string }> = {
  blue: { bg: 'bg-blue-500/10', icon: 'text-blue-600', progress: 'bg-blue-500' },
  green: { bg: 'bg-emerald-500/10', icon: 'text-emerald-600', progress: 'bg-emerald-500' },
  red: { bg: 'bg-red-500/10', icon: 'text-red-600', progress: 'bg-red-500' },
  amber: { bg: 'bg-amber-500/10', icon: 'text-amber-600', progress: 'bg-amber-500' },
  cyan: { bg: 'bg-cyan-500/10', icon: 'text-cyan-600', progress: 'bg-cyan-500' },
  violet: { bg: 'bg-violet-500/10', icon: 'text-violet-600', progress: 'bg-violet-500' },
  emerald: { bg: 'bg-emerald-500/10', icon: 'text-emerald-600', progress: 'bg-emerald-500' },
  orange: { bg: 'bg-orange-500/10', icon: 'text-orange-600', progress: 'bg-orange-500' },
  pink: { bg: 'bg-pink-500/10', icon: 'text-pink-600', progress: 'bg-pink-500' },
  indigo: { bg: 'bg-indigo-500/10', icon: 'text-indigo-600', progress: 'bg-indigo-500' },
};

export default function StatCard({
  title,
  value,
  icon: Icon,
  color = 'blue',
  className,
  progressPercent,
  progressColor,
}: StatCardProps) {
  const colors = colorMap[color] || colorMap.blue;

  return (
    <div
      className={cn(
        'rounded-xl border border-border bg-card p-4 hover:shadow-md transition-all duration-300',
        className
      )}
    >
      <div className="flex items-start justify-between mb-2">
        {Icon && (
          <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', colors.bg)}>
            <Icon className={cn('h-4 w-4', colors.icon)} />
          </div>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold tracking-tight">{value}</p>
        <p className="text-xs text-muted-foreground mt-0.5 font-medium">{title}</p>
      </div>
      {progressPercent !== undefined && (
        <div className="mt-3 h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className={cn('h-full rounded-full', progressColor || colors.progress)}
            style={{ width: `${Math.min(progressPercent, 100)}%` }}
          />
        </div>
      )}
    </div>
  );
}
