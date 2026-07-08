import { useQuery } from '@tanstack/react-query';
import { platformService } from '@/services/platform-service';

export const queryKeys = {
  dashboard: ['dashboard'] as const,
  hourly: ['analytics', 'hourly'] as const,
  daily: (days: number) => ['analytics', 'daily', days] as const,
  weekly: (weeks: number) => ['analytics', 'weekly', weeks] as const,
  monthly: (months: number) => ['analytics', 'monthly', months] as const,
  events: (from?: string, to?: string) => ['visitor-events', from, to] as const,
  store: ['store'] as const,
  cameras: ['cameras'] as const,
  agents: ['agents'] as const
};

export function useDashboardQuery() {
  return useQuery({
    queryKey: queryKeys.dashboard,
    queryFn: platformService.dashboard,
    refetchInterval: 30_000
  });
}

export function useHourlyQuery() {
  return useQuery({
    queryKey: queryKeys.hourly,
    queryFn: platformService.hourly,
    refetchInterval: 30_000
  });
}

export function useDailyQuery(days = 30) {
  return useQuery({ queryKey: queryKeys.daily(days), queryFn: () => platformService.daily(days) });
}

export function useWeeklyQuery(weeks = 12) {
  return useQuery({ queryKey: queryKeys.weekly(weeks), queryFn: () => platformService.weekly(weeks) });
}

export function useMonthlyQuery(months = 12) {
  return useQuery({ queryKey: queryKeys.monthly(months), queryFn: () => platformService.monthly(months) });
}

export function useEventsQuery(from?: string, to?: string) {
  return useQuery({
    queryKey: queryKeys.events(from, to),
    queryFn: () => platformService.events({ from, to }),
    refetchInterval: 30_000
  });
}

export function useStoreQuery() {
  return useQuery({ queryKey: queryKeys.store, queryFn: platformService.store });
}

export function useCamerasQuery() {
  return useQuery({ queryKey: queryKeys.cameras, queryFn: platformService.cameras });
}

export function useAgentsQuery() {
  return useQuery({ queryKey: queryKeys.agents, queryFn: platformService.agents, refetchInterval: 30_000 });
}
