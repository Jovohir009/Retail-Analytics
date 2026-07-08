import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AnalyticsService } from './analytics.service';

@UseGuards(JwtAuthGuard)
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard')
  dashboard(@CurrentUser() user: { userId: string }) {
    return this.analyticsService.dashboard(user.userId);
  }

  @Get('hourly')
  hourly(@CurrentUser() user: { userId: string }) {
    return this.analyticsService.hourly(user.userId);
  }

  @Get('daily')
  daily(@CurrentUser() user: { userId: string }, @Query('days') days?: string) {
    return this.analyticsService.daily(user.userId, days ? Number(days) : undefined);
  }

  @Get('weekly')
  weekly(@CurrentUser() user: { userId: string }, @Query('weeks') weeks?: string) {
    return this.analyticsService.weekly(user.userId, weeks ? Number(weeks) : undefined);
  }

  @Get('monthly')
  monthly(@CurrentUser() user: { userId: string }, @Query('months') months?: string) {
    return this.analyticsService.monthly(user.userId, months ? Number(months) : undefined);
  }
}
