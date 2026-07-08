import { Bot, Camera, type LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { StatusPill } from '@/components/ui/status-pill';
import { relativeTime, statusLabel } from '@/lib/format';
import type { AiAgent, Camera as CameraType } from '@/types/api';

export function SystemHealth({
  camera,
  agent
}: {
  camera: CameraType | undefined;
  agent: AiAgent | undefined;
}) {
  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-ink">System health</h2>
      </div>
      <HealthRow
        icon={Camera}
        title={camera?.name ?? 'Camera not configured'}
        description={camera ? `Last sync ${relativeTime(camera.lastSyncAt)}` : 'Create a camera to begin setup'}
        status={camera?.status}
      />
      <HealthRow
        icon={Bot}
        title={agent?.name ?? 'AI Agent not registered'}
        description={agent ? `Last seen ${relativeTime(agent.lastSeenAt)}` : 'Register an agent after creating a camera'}
        status={agent?.status}
      />
    </Card>
  );
}

function HealthRow({
  icon: Icon,
  title,
  description,
  status
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  status?: string | null;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl bg-slate-50 p-4">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-slate-600 shadow-sm">
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-ink">{title}</p>
          <p className="mt-1 text-xs text-muted">{description}</p>
        </div>
      </div>
      {status ? <StatusPill status={status} /> : <span className="text-xs text-muted">{statusLabel(status)}</span>}
    </div>
  );
}
