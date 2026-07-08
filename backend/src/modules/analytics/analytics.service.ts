import { Injectable } from '@nestjs/common';
import { VisitorEvent } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { StoresService } from '../stores/stores.service';
import { ConfigService } from '@nestjs/config';
import { resolveAgentStatus, resolveCameraStatus } from '../agent/agent-status.util';
import { addDays, addMonths, hourLabel, startOfUtcDay } from './date-range.util';
import { DashboardStats, TimeBucket } from './analytics.types';

@Injectable()
export class AnalyticsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storesService: StoresService,
    private readonly config: ConfigService
  ) {}

  async dashboard(userId: string): Promise<DashboardStats> {
    const store = await this.storesService.findOwnedStore(userId);
    const todayStart = startOfUtcDay(new Date());
    const tomorrowStart = addDays(todayStart, 1);
    const yesterdayStart = addDays(todayStart, -1);
    const [todayVisitors, yesterdayVisitors, hourly, camera, agent] = await Promise.all([
      this.countEvents(store.id, todayStart, tomorrowStart),
      this.countEvents(store.id, yesterdayStart, todayStart),
      this.hourly(userId, todayStart, tomorrowStart),
      this.prisma.camera.findFirst({ where: { storeId: store.id, deletedAt: null } }),
      this.prisma.aiAgent.findFirst({ where: { storeId: store.id }, orderBy: { createdAt: 'desc' } })
    ]);

    const peakHour = hourly.reduce<TimeBucket | null>(
      (peak, bucket) => (!peak || bucket.count > peak.count ? bucket : peak),
      null
    );

    const threshold = this.config.get<number>('AGENT_OFFLINE_THRESHOLD_SECONDS', 90);
    return {
      todayVisitors,
      liveVisitorCount: todayVisitors,
      peakHour,
      visitorTrendPercent: calculateTrendPercent(todayVisitors, yesterdayVisitors),
      cameraStatus: camera ? resolveCameraStatus(camera.status, camera.lastSyncAt, threshold) : null,
      agentStatus: agent ? resolveAgentStatus(agent.status, agent.lastSeenAt, threshold) : null
    };
  }

  async hourly(userId: string, from?: Date, to?: Date): Promise<TimeBucket[]> {
    const store = await this.storesService.findOwnedStore(userId);
    const start = from ?? startOfUtcDay(new Date());
    const end = to ?? addDays(start, 1);
    const events = await this.events(store.id, start, end);
    const buckets = Array.from({ length: 24 }, (_, hour) => ({ label: hourLabel(hour), count: 0 }));
    for (const event of events) {
      buckets[event.occurredAt.getUTCHours()].count += 1;
    }
    return buckets;
  }

  async daily(userId: string, days = 30): Promise<TimeBucket[]> {
    const store = await this.storesService.findOwnedStore(userId);
    const end = addDays(startOfUtcDay(new Date()), 1);
    const start = addDays(end, -days);
    const events = await this.events(store.id, start, end);
    const buckets = new Map<string, number>();
    for (let offset = 0; offset < days; offset += 1) {
      const day = addDays(start, offset).toISOString().slice(0, 10);
      buckets.set(day, 0);
    }
    for (const event of events) {
      const key = event.occurredAt.toISOString().slice(0, 10);
      buckets.set(key, (buckets.get(key) ?? 0) + 1);
    }
    return [...buckets.entries()].map(([label, count]) => ({ label, count }));
  }

  async weekly(userId: string, weeks = 12): Promise<TimeBucket[]> {
    const daily = await this.daily(userId, weeks * 7);
    const buckets: TimeBucket[] = [];
    for (let index = 0; index < daily.length; index += 7) {
      const slice = daily.slice(index, index + 7);
      buckets.push({
        label: slice[0]?.label ?? `week-${index / 7 + 1}`,
        count: slice.reduce((sum, bucket) => sum + bucket.count, 0)
      });
    }
    return buckets;
  }

  async monthly(userId: string, months = 12): Promise<TimeBucket[]> {
    const store = await this.storesService.findOwnedStore(userId);
    const now = new Date();
    const end = addMonths(new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)), 1);
    const start = addMonths(end, -months);
    const events = await this.events(store.id, start, end);
    const buckets = new Map<string, number>();
    for (let offset = 0; offset < months; offset += 1) {
      const month = addMonths(start, offset).toISOString().slice(0, 7);
      buckets.set(month, 0);
    }
    for (const event of events) {
      const key = event.occurredAt.toISOString().slice(0, 7);
      buckets.set(key, (buckets.get(key) ?? 0) + 1);
    }
    return [...buckets.entries()].map(([label, count]) => ({ label, count }));
  }

  private async events(storeId: string, from: Date, to: Date): Promise<VisitorEvent[]> {
    return this.prisma.visitorEvent.findMany({
      where: {
        storeId,
        occurredAt: { gte: from, lt: to }
      },
      orderBy: { occurredAt: 'asc' }
    });
  }

  private countEvents(storeId: string, from: Date, to: Date): Promise<number> {
    return this.prisma.visitorEvent.count({
      where: { storeId, occurredAt: { gte: from, lt: to } }
    });
  }
}

export function calculateTrendPercent(current: number, previous: number): number {
  if (previous === 0) {
    return current === 0 ? 0 : 100;
  }
  return Math.round(((current - previous) / previous) * 10000) / 100;
}
