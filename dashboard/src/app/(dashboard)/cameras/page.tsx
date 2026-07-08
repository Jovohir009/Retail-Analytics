'use client';

import { Bot, Camera, Clock, ShieldCheck, Signal, type LucideIcon } from 'lucide-react';
import { Card, CardHeader } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { StatusPill } from '@/components/ui/status-pill';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/state/empty-state';
import { ErrorState } from '@/components/state/error-state';
import { AgentRegistration } from '@/features/cameras/agent-registration';
import { CameraForm } from '@/features/cameras/camera-form';
import { useAgentsQuery, useCamerasQuery } from '@/hooks/use-platform-queries';
import { formatCameraType, formatDateTime, relativeTime } from '@/lib/format';

export default function CamerasPage() {
  const cameras = useCamerasQuery();
  const agents = useAgentsQuery();

  if (cameras.isError) {
    return <ErrorState message={cameras.error.message} onRetry={() => cameras.refetch()} />;
  }

  const camera = cameras.data?.[0];
  const agent = agents.data?.[0];

  return (
    <>
      <PageHeader
        title="Camera"
        description="Manage the single MVP camera and its AI Agent connection. Camera credentials are never displayed in the cloud dashboard."
      />

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.95fr]">
        <Card>
          <CardHeader title="Camera details" description="Metadata used by the backend to identify the entrance camera." />
          {cameras.isLoading ? (
            <Skeleton className="h-64" />
          ) : camera ? (
            <div className="grid gap-4 md:grid-cols-2">
              <InfoTile icon={Camera} label="Name" value={camera.name} />
              <InfoTile icon={Signal} label="Status" value={<StatusPill status={camera.status} />} />
              <InfoTile icon={ShieldCheck} label="Camera type" value={formatCameraType(camera.type)} />
              <InfoTile icon={Clock} label="Last synchronization" value={formatDateTime(camera.lastSyncAt)} />
            </div>
          ) : (
            <EmptyState
              icon={Camera}
              title="No camera configured"
              description="Create the entrance camera record before registering the local AI Agent."
            />
          )}
        </Card>

        <Card>
          <CardHeader title={camera ? 'Edit camera' : 'Create camera'} description="Cloud metadata only. RTSP URLs and passwords remain local to the AI Agent." />
          <CameraForm camera={camera} />
        </Card>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.35fr_0.95fr]">
        <Card>
          <CardHeader title="AI Agent" description="The local Windows agent processes video and synchronizes visitor events." />
          {agents.isLoading ? (
            <Skeleton className="h-48" />
          ) : agent ? (
            <div className="grid gap-4 md:grid-cols-2">
              <InfoTile icon={Bot} label="Agent name" value={agent.name} />
              <InfoTile icon={Signal} label="Connection" value={<StatusPill status={agent.status} />} />
              <InfoTile icon={Clock} label="Last seen" value={relativeTime(agent.lastSeenAt)} />
              <InfoTile icon={ShieldCheck} label="Agent version" value="Not reported by current agent" />
            </div>
          ) : (
            <EmptyState
              icon={Bot}
              title="No AI Agent registered"
              description="Register an agent to obtain the secure token used for heartbeat and event synchronization."
            />
          )}
        </Card>

        <Card>
          <CardHeader title="Register AI Agent" description="Generate an agent token for the local Windows installation." />
          <AgentRegistration camera={camera} />
        </Card>
      </div>
    </>
  );
}

function InfoTile({
  icon: Icon,
  label,
  value
}: {
  icon: LucideIcon;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-600 shadow-sm">
          <Icon className="h-5 w-5" />
        </div>
        <p className="text-sm font-medium text-muted">{label}</p>
      </div>
      <div className="mt-4 text-sm font-semibold text-ink">{value}</div>
    </div>
  );
}
