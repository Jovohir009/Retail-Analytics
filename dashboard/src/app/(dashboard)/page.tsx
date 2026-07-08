'use client';

import { Activity, BarChart3, Clock3, TrendingUp, Users } from 'lucide-react';
import { Card, CardHeader } from '@/components/ui/card';
import { MetricCard } from '@/components/ui/metric-card';
import { PageHeader } from '@/components/ui/page-header';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorState } from '@/components/state/error-state';
import { TrafficBarChart } from '@/components/charts/traffic-bar-chart';
import { TrendLineChart } from '@/components/charts/trend-line-chart';
import { RecentActivity } from '@/features/dashboard/recent-activity';
import { SystemHealth } from '@/features/dashboard/system-health';
import {
  useAgentsQuery,
  useCamerasQuery,
  useDailyQuery,
  useDashboardQuery,
  useEventsQuery,
  useHourlyQuery,
  useMonthlyQuery
} from '@/hooks/use-platform-queries';
import { formatNumber, formatPercent } from '@/lib/format';

export default function DashboardPage() {
  const dashboard = useDashboardQuery();
  const hourly = useHourlyQuery();
  const daily = useDailyQuery(7);
  const monthly = useMonthlyQuery(12);
  const events = useEventsQuery();
  const cameras = useCamerasQuery();
  const agents = useAgentsQuery();

  if (dashboard.isError) {
    return <ErrorState message={dashboard.error.message} onRetry={() => dashboard.refetch()} />;
  }

  const stats = dashboard.data;
  const camera = cameras.data?.[0];
  const agent = agents.data?.[0];
  const peakHour = stats?.peakHour?.label ?? 'No peak yet';

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="A live operating view of visitor entries, camera health, AI Agent status, and traffic patterns."
      >
        <Badge tone="blue">Auto-refreshing</Badge>
      </PageHeader>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats ? (
          <>
            <MetricCard
              icon={Users}
              label="Today's visitors"
              value={formatNumber(stats.todayVisitors)}
              detail="Entries counted today"
              trend={<Badge tone={stats.visitorTrendPercent >= 0 ? 'green' : 'rose'}>{formatPercent(stats.visitorTrendPercent)}</Badge>}
            />
            <MetricCard
              icon={Activity}
              label="Live visitor count"
              value={formatNumber(stats.liveVisitorCount)}
              detail="From synchronized events"
            />
            <MetricCard icon={Clock3} label="Peak hour" value={peakHour} detail="Busiest hour today" />
            <MetricCard
              icon={TrendingUp}
              label="Monthly visitors"
              value={formatNumber(monthly.data?.reduce((sum, item) => sum + item.count, 0))}
              detail="Current 12-month window"
            />
          </>
        ) : (
          Array.from({ length: 4 }, (_, index) => <Skeleton key={index} className="h-40" />)
        )}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.65fr_1fr]">
        <Card>
          <CardHeader title="Hourly traffic" description="Entries grouped by hour for the current day." />
          {hourly.data ? <TrafficBarChart data={hourly.data} /> : <Skeleton className="h-72" />}
        </Card>
        <SystemHealth camera={camera} agent={agent} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader title="Weekly trend" description="Daily visitor pattern for the last seven days." />
          {daily.data ? <TrendLineChart data={daily.data} /> : <Skeleton className="h-72" />}
        </Card>
        <Card>
          <CardHeader title="Recent activity" description="Latest synchronized visitor entries." />
          {events.data ? <RecentActivity events={events.data} /> : <Skeleton className="h-72" />}
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader title="Monthly trend" description="Longer-term movement generated from stored visitor events." />
        {monthly.data ? <TrendLineChart data={monthly.data} /> : <Skeleton className="h-72" />}
      </Card>
    </>
  );
}
