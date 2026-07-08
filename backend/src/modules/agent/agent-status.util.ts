import { AgentStatus, CameraStatus } from '@prisma/client';

export function resolveAgentStatus(
  status: AgentStatus,
  lastSeenAt: Date | null,
  offlineThresholdSeconds: number
): AgentStatus {
  if (!lastSeenAt) {
    return AgentStatus.OFFLINE;
  }
  const ageMs = Date.now() - lastSeenAt.getTime();
  return ageMs > offlineThresholdSeconds * 1000 ? AgentStatus.OFFLINE : status;
}

export function resolveCameraStatus(
  status: CameraStatus,
  lastSyncAt: Date | null,
  offlineThresholdSeconds: number
): CameraStatus {
  if (!lastSyncAt) {
    return CameraStatus.OFFLINE;
  }
  const ageMs = Date.now() - lastSyncAt.getTime();
  return ageMs > offlineThresholdSeconds * 1000 ? CameraStatus.OFFLINE : status;
}
