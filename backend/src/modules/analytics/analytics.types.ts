export interface TimeBucket {
  label: string;
  count: number;
}

export interface DashboardStats {
  todayVisitors: number;
  liveVisitorCount: number;
  peakHour: TimeBucket | null;
  visitorTrendPercent: number;
  cameraStatus: string | null;
  agentStatus: string | null;
}
