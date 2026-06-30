import { ReactNode } from 'react';
import Link from 'next/link';
import { TrendingUp, TrendingDown } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: number | string;
  trend?: {
    value: string;
    positive: boolean;
  };
  Icon: LucideIcon;
  href?: string;
}

export function MetricCard({ label, value, trend, Icon, href }: MetricCardProps) {
  const card = (
    <div className="group/card flex flex-col gap-3 rounded-xl bg-card py-4 ring-1 ring-foreground/10 bg-gradient-to-t from-primary/5 to-card">
      <div className="px-4">
        <div className="flex size-7 items-center justify-center rounded-lg border border-border bg-muted text-muted-foreground">
          <Icon className="size-4" />
        </div>
      </div>
      <div className="px-4">
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
      <div className="px-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-2xl font-semibold tabular-nums tracking-tight leading-none text-foreground">
            {value}
          </span>
          {trend && (
            <span className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-medium ${
              trend.positive ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
            }`}>
              {trend.positive ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
              {trend.value}
            </span>
          )}
        </div>
        <p className="mt-1 text-xs text-muted-foreground">Overview metric</p>
      </div>
    </div>
  );

  return href ? <Link href={href}>{card}</Link> : card;
}

interface SectionCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  action?: ReactNode;
}

export function SectionCard({ title, description, children, action }: SectionCardProps) {
  return (
    <div className="flex flex-col gap-4 rounded-xl bg-card ring-1 ring-foreground/10 overflow-hidden">
      <div className="flex items-center justify-between px-5 pt-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
        </div>
        {action}
      </div>
      <div className="px-5 pb-5">
        {children}
      </div>
    </div>
  );
}

interface PriorityBadgeProps {
  priority: string;
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const colors: Record<string, string> = {
    critical: 'bg-red-100 text-red-800 border-red-200',
    high: 'bg-orange-100 text-orange-800 border-orange-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    low: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  };
  return (
    <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-medium ${colors[priority] || 'bg-muted text-muted-foreground border-border'}`}>
      {priority}
    </span>
  );
}

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const colors: Record<string, string> = {
    open: 'bg-blue-100 text-blue-800',
    in_progress: 'bg-yellow-100 text-yellow-800',
    closed: 'bg-emerald-100 text-emerald-800',
    submitted: 'bg-purple-100 text-purple-800',
    in_review: 'bg-indigo-100 text-indigo-800',
    approved: 'bg-emerald-100 text-emerald-800',
    rejected: 'bg-red-100 text-red-800',
  };
  return (
    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium ${colors[status] || 'bg-muted text-muted-foreground'}`}>
      {status.replace(/_/g, ' ')}
    </span>
  );
}

export function MetricSkeleton() {
  return (
    <div className="flex flex-col gap-3 rounded-xl bg-card py-4 ring-1 ring-foreground/10">
      <div className="px-4"><div className="h-7 w-7 rounded-lg bg-muted animate-pulse" /></div>
      <div className="px-4"><div className="h-4 w-20 rounded bg-muted animate-pulse" /></div>
      <div className="px-4"><div className="h-6 w-16 rounded bg-muted animate-pulse" /></div>
    </div>
  );
}
