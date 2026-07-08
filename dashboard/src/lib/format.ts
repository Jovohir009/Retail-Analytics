import { format, formatDistanceToNowStrict, parseISO } from 'date-fns';

export function formatNumber(value: number | null | undefined): string {
  return new Intl.NumberFormat('en-US').format(value ?? 0);
}

export function formatPercent(value: number | null | undefined): string {
  const normalized = value ?? 0;
  return `${normalized > 0 ? '+' : ''}${normalized.toFixed(Math.abs(normalized) % 1 === 0 ? 0 : 1)}%`;
}

export function formatDateTime(value: string | null | undefined): string {
  if (!value) {
    return 'Not synced yet';
  }
  return format(parseISO(value), 'MMM d, yyyy HH:mm');
}

export function relativeTime(value: string | null | undefined): string {
  if (!value) {
    return 'No activity yet';
  }
  return `${formatDistanceToNowStrict(parseISO(value))} ago`;
}

export function formatCameraType(value: string): string {
  return value
    .split('_')
    .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
    .join(' ');
}

export function statusLabel(value: string | null | undefined): string {
  if (!value) {
    return 'Not configured';
  }
  return value.charAt(0) + value.slice(1).toLowerCase();
}
