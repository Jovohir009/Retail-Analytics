import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CurrentAgent } from '../../common/decorators/current-agent.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AgentAuthGuard } from './agent-auth.guard';
import { AgentService } from './agent.service';
import { HeartbeatDto } from './dto/heartbeat.dto';
import { RegisterAgentDto } from './dto/register-agent.dto';
import { SyncEventsDto } from './dto/sync-events.dto';

@Controller('agent')
export class AgentController {
  constructor(private readonly agentService: AgentService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  list(@CurrentUser() user: { userId: string }) {
    return this.agentService.listForUser(user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('register')
  register(@CurrentUser() user: { userId: string }, @Body() dto: RegisterAgentDto) {
    return this.agentService.register(user.userId, dto);
  }

  @UseGuards(AgentAuthGuard)
  @Post('heartbeat')
  heartbeat(@CurrentAgent() agent: { agentId: string; storeId: string; cameraId: string }, @Body() dto: HeartbeatDto) {
    return this.agentService.heartbeat(agent, dto);
  }

  @UseGuards(AgentAuthGuard)
  @Post('events/batch')
  syncEvents(@CurrentAgent() agent: { agentId: string; storeId: string; cameraId: string }, @Body() dto: SyncEventsDto) {
    return this.agentService.syncEvents(agent, dto);
  }
}
