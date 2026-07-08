'use client';

import { useMemo, useState } from 'react';
import { BarChart3, CalendarDays, LineChart } from 'lucide-react';
import { Card, CardHeader } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MetricCard } from '@/components/ui/metric-card';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorState } from '@/components/state/error-state';
import { TrafficBarChart } from '@/components/charts/traffic-bar-chart';
import { TrendLineChart } from '@/components/charts/trend-line-chart';
import { useEventsQuery, useMonthlyQuery, useWeeklyQuery } from '@/hooks/use-platform-queries';
import { formatNumber } from '@/lib/format';
import {
  RangePreset,
  aggregateEventsByDay,
  aggregateEventsByHour,
  rangeToDates
} from '@/features/analytics/aggregate-events';

const presets: { label: string; value: RangePreset }[] = [
  { label: 'Today', value: 'today' },
  { label: 'Yesterday', value: 'yesterday' },
  { label: '7 Days', value: '7d' },
  { label: '30 Days', value: '30d' },
  { label: 'Custom', value: 'custom' }
];

export default function AnalyticsPage() {
  const [preset, setPreset] = useState<RangePreset>('7d');
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');
  const range = useMemo(() => rangeToDates(preset, customFrom, customTo), [customFrom, customTo, preset]);
  const events = useEventsQuery(range.from.toISOString(), range.to.toISOString());
  const weekly = useWeeklyQuery(12);
  const monthly = useMonthlyQuery(12);

  const chartData = useMemo(() => {
    if (!events.data) return [];
    return preset === 'today' || preset === 'yesterday'
      ? aggregateEventsByHour(events.data)
      : aggregateEventsByDay(events.data, range.from, range.to);
  }, [events.data, preset, range.from, range.to]);

  const total = chartData.reduce((sum, bucket) => sum + bucket.count, 0);
  const average = chartData.length ? Math.round(total / chartData.length) : 0;
  const busiest = chartData.reduce((peak, bucket) => (bucket.count > peak.count ? bucket : peak), {
    label: 'None',
    count: 0
  });

  return (
    <>
      <PageHeader
        title="Analytics"
        description="Explore visitor traffic by day, week, month, or a custom date range. All charts are generated from immutable visitor events."
      />

      <Card className="mb-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {presets.map((item) => (
              <Button
                key={item.value}
                variant={preset === item.value ? 'primary' : 'secondary'}
                onClick={() => setPreset(item.value)}
              >
                {item.label}
              </Button>
            ))}
          </div>
          {preset === 'custom' ? (
            <div className="grid gap-3 sm:grid-cols-2">
              <Input type="date" value={customFrom} onChange={(event) => setCustomFrom(event.target.value)} />
              <Input type="date" value={customTo} onChange={(event) => setCustomTo(event.target.value)} />
            </div>
          ) : null}
        </div>
      </Card>

      {events.isError ? (
        <ErrorState message={events.error.message} onRetry={() => events.refetch()} />
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <MetricCard icon={BarChart3} label="Entries" value={formatNumber(total)} detail="Selected range" />
            <MetricCard icon={LineChart} label="Average" value={formatNumber(average)} detail="Per chart bucket" />
            <MetricCard icon={CalendarDays} label="Busiest bucket" value={busiest.label} detail={`${formatNumber(busiest.count)} entries`} />
          </div>

          <Card className="mt-6">
            <CardHeader
              title={preset === 'today' || preset === 'yesterday' ? 'Hourly traffic' : 'Daily traffic'}
              description="Use the range controls to compare traffic patterns without changing backend business logic."
            />
            {events.data ? <TrafficBarChart data={chartData} /> : <Skeleton className="h-72" />}
          </Card>
        </>
      )}

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader title="Weekly visitors" description="Twelve-week view from synchronized visitor history." />
          {weekly.data ? <TrendLineChart data={weekly.data} /> : <Skeleton className="h-72" />}
        </Card>
        <Card>
          <CardHeader title="Monthly visitors" description="Twelve-month visitor trend for longer-term planning." />
          {monthly.data ? <TrendLineChart data={monthly.data} /> : <Skeleton className="h-72" />}
        </Card>
      </div>
    </>
  );
}
