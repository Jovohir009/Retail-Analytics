export interface ApiSuccess<T> {
  success: true;
  message: string;
  data: T;
}

export interface ApiFailure {
  success: false;
  message: string;
  errors: string[];
}

export type ApiEnvelope<T> = ApiSuccess<T> | ApiFailure;

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Store {
  id: string;
  ownerId: string;
  name: string;
  address: string | null;
  timeZone: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export type CameraType = 'WEBCAM' | 'RTSP' | 'VIDEO_FILE';
export type CameraStatus = 'ONLINE' | 'OFFLINE';
export type AgentStatus = 'ONLINE' | 'OFFLINE' | 'SYNCHRONIZING';

export interface Camera {
  id: string;
  storeId: string;
  name: string;
  type: CameraType;
  status: CameraStatus;
  lastSyncAt: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface AiAgent {
  id: string;
  storeId: string;
  cameraId: string;
  name: string;
  status: AgentStatus;
  lastSeenAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface VisitorEvent {
  id: string;
  storeId: string;
  cameraId: string;
  agentId: string;
  occurredAt: string;
  direction: string;
  createdAt: string;
}

export interface TimeBucket {
  label: string;
  count: number;
}

export interface DashboardStats {
  todayVisitors: number;
  liveVisitorCount: number;
  peakHour: TimeBucket | null;
  visitorTrendPercent: number;
  cameraStatus: CameraStatus | null;
  agentStatus: AgentStatus | null;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
}

export interface RegisterResponse {
  user: User;
  store: Store;
  accessToken: string;
}

export interface AgentRegistrationResponse {
  agent: AiAgent;
  token: string;
}
