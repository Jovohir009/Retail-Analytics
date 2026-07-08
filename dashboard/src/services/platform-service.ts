import { apiRequest } from '@/lib/api-client';
import type {
  AgentRegistrationResponse,
  AiAgent,
  Camera,
  CameraType,
  DashboardStats,
  Store,
  TimeBucket,
  VisitorEvent
} from '@/types/api';

export const platformService = {
  dashboard: () => apiRequest<DashboardStats>('/analytics/dashboard'),
  hourly: () => apiRequest<TimeBucket[]>('/analytics/hourly'),
  daily: (days = 30) => apiRequest<TimeBucket[]>(`/analytics/daily?days=${days}`),
  weekly: (weeks = 12) => apiRequest<TimeBucket[]>(`/analytics/weekly?weeks=${weeks}`),
  monthly: (months = 12) => apiRequest<TimeBucket[]>(`/analytics/monthly?months=${months}`),
  events: (params?: { from?: string; to?: string }) => {
    const query = new URLSearchParams();
    if (params?.from) query.set('from', params.from);
    if (params?.to) query.set('to', params.to);
    return apiRequest<VisitorEvent[]>(`/visitor-events${query.size ? `?${query}` : ''}`);
  },
  store: () => apiRequest<Store>('/stores/current'),
  updateStore: (payload: { name?: string; address?: string; timeZone?: string }) =>
    apiRequest<Store>('/stores/current', {
      method: 'PATCH',
      body: JSON.stringify(payload)
    }),
  cameras: () => apiRequest<Camera[]>('/cameras'),
  createCamera: (payload: { name: string; type: CameraType }) =>
    apiRequest<Camera>('/cameras', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
  updateCamera: (cameraId: string, payload: { name: string; type: CameraType }) =>
    apiRequest<Camera>(`/cameras/${cameraId}`, {
      method: 'PATCH',
      body: JSON.stringify(payload)
    }),
  agents: () => apiRequest<AiAgent[]>('/agent'),
  registerAgent: (payload: { cameraId: string; name: string }) =>
    apiRequest<AgentRegistrationResponse>('/agent/register', {
      method: 'POST',
      body: JSON.stringify(payload)
    })
};
