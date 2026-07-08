import { addDays, endOfDay, format, parseISO, startOfDay, subDays } from 'date-fns';
import type { TimeBucket, VisitorEvent } from '@/types/api';

export type RangePreset = 'today' | 'yesterday' | '7d' | '30d' | 'custom';

export function rangeToDates(preset: RangePreset, customFrom?: string, customTo?: string) {
  const now = new Date();
  if (preset === 'today') {
    return { from: startOfDay(now), to: endOfDay(now) };
  }
  if (preset === 'yesterday') {
    const yesterday = subDays(now, 1);
    return { from: startOfDay(yesterday), to: endOfDay(yesterday) };
  }
  if (preset === '7d') {
    return { from: startOfDay(subDays(now, 6)), to: endOfDay(now) };
  }
  if (preset === '30d') {
    return { from: startOfDay(subDays(now, 29)), to: endOfDay(now) };
  }
  return {
    from: customFrom ? startOfDay(parseISO(customFrom)) : startOfDay(subDays(now, 6)),
    to: customTo ? endOfDay(parseISO(customTo)) : endOfDay(now)
  };
}

export function aggregateEventsByDay(events: VisitorEvent[], from: Date, to: Date): TimeBucket[] {
  const buckets = new Map<string, number>();
  let cursor = startOfDay(from);
  const end = startOfDay(to);
  while (cursor <= end) {
    buckets.set(format(cursor, 'yyyy-MM-dd'), 0);
    cursor = addDays(cursor, 1);
  }
  for (const event of events) {
    const key = format(parseISO(event.occurredAt), 'yyyy-MM-dd');
    if (buckets.has(key)) {
      buckets.set(key, (buckets.get(key) ?? 0) + 1);
    }
  }
  return [...buckets.entries()].map(([label, count]) => ({ label, count }));
}

export function aggregateEventsByHour(events: VisitorEvent[]): TimeBucket[] {
  const buckets = Array.from({ length: 24 }, (_, hour) => ({
    label: `${hour.toString().padStart(2, '0')}:00`,
    count: 0
  }));
  for (const event of events) {
    buckets[parseISO(event.occurredAt).getHours()].count += 1;
  }
  return buckets;
}
