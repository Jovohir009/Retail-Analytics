import { Clock, Footprints } from 'lucide-react';
import { EmptyState } from '@/components/state/empty-state';
import { formatDateTime, relativeTime } from '@/lib/format';
import type { VisitorEvent } from '@/types/api';

export function RecentActivity({ events }: { events: VisitorEvent[] }) {
  if (!events.length) {
    return (
      <EmptyState
        icon={Footprints}
        title="No visitor events yet"
        description="Synchronized entries will appear here as soon as the AI Agent uploads visitor events."
      />
    );
  }

  return (
    <div className="space-y-3">
      {events.slice(0, 7).map((event) => (
        <div key={event.id} className="flex items-center justify-between gap-4 rounded-2xl bg-slate-50 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-primary-600 shadow-sm">
              <Footprints className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-medium text-ink">Visitor entry recorded</p>
              <p className="text-xs text-muted">{formatDateTime(event.occurredAt)}</p>
            </div>
          </div>
          <div className="hidden items-center gap-1 text-xs text-muted sm:flex">
            <Clock className="h-3.5 w-3.5" />
            {relativeTime(event.occurredAt)}
          </div>
        </div>
      ))}
    </div>
  );
}
