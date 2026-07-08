import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { VisitorEventsService } from './visitor-events.service';

@UseGuards(JwtAuthGuard)
@Controller('visitor-events')
export class VisitorEventsController {
  constructor(private readonly visitorEventsService: VisitorEventsService) {}

  @Get()
  list(
    @CurrentUser() user: { userId: string },
    @Query('from') from?: string,
    @Query('to') to?: string
  ) {
    return this.visitorEventsService.listForUser(
      user.userId,
      from ? new Date(from) : undefined,
      to ? new Date(to) : undefined
    );
  }
}
