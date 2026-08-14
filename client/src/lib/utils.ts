import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-IN').format(num);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date));
}

export function formatDateShort(date: string | Date): string {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date));
}

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(date));
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    ACTIVE: 'bg-success/10 text-success border-success/20',
    GRADUATED: 'bg-info/10 text-info border-info/20',
    QUIT: 'bg-destructive/10 text-destructive border-destructive/20',
    TRANSFERRED_OUT: 'bg-warning/10 text-warning border-warning/20',
    TRANSFERRED_IN: 'bg-info/10 text-info border-info/20',
    NEW: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    CONTACTED: 'bg-cyan-500/10 text-cyan-600 border-cyan-500/20',
    FOLLOW_UP: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    TRIAL_CLASS: 'bg-violet-500/10 text-violet-600 border-violet-500/20',
    CONVERTED: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    LOST: 'bg-red-500/10 text-red-600 border-red-500/20',
    Dispatched: 'bg-success/10 text-success border-success/20',
    'Dispatch Details': 'bg-info/10 text-info border-info/20',
    'Delivered Date': 'bg-success/10 text-success border-success/20',
    PENDING: 'bg-warning/10 text-warning border-warning/20',
    APPROVED: 'bg-success/10 text-success border-success/20',
    REJECTED: 'bg-destructive/10 text-destructive border-destructive/20',
  };
  return colors[status] || 'bg-muted text-muted-foreground border-border';
}

export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
