import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { AgentStatus, CameraStatus, Prisma } from '@prisma/client';
import { AuthenticatedAgent } from '../../common/decorators/current-agent.decorator';
import { createOpaqueToken, hashAgentToken } from '../../common/utils/token.util';
import { ConfigService } from '@nestjs/config';
import { CamerasService } from '../cameras/cameras.service';
import { PrismaService } from '../prisma/prisma.service';
import { StoresService } from '../stores/stores.service';
import { resolveAgentStatus } from './agent-status.util';
import { HeartbeatDto } from './dto/heartbeat.dto';
import { RegisterAgentDto } from './dto/register-agent.dto';
import { SyncEventsDto } from './dto/sync-events.dto';

@Injectable()
export class AgentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storesService: StoresService,
    private readonly camerasService: CamerasService,
    private readonly config: ConfigService
  ) {}

  async register(userId: string, dto: RegisterAgentDto) {
    const store = await this.storesService.findOwnedStore(userId);
    const camera = await this.camerasService.ensureOwnedCamera(userId, dto.cameraId);
    const token = createOpaqueToken();
    const apiTokenHash = hashAgentToken(
      token,
      this.config.getOrThrow<string>('AGENT_TOKEN_PEPPER')
    );
    const agent = await this.prisma.aiAgent.create({
      data: {
        storeId: store.id,
        cameraId: camera.id,
        name: dto.name,
        apiTokenHash
      }
    });

    return {
      message: 'AI Agent registered successfully. Store the token securely; it is shown only once.',
      data: { agent, token }
    };
  }

  async heartbeat(agent: AuthenticatedAgent, dto: HeartbeatDto) {
    this.assertAgentScope(agent, dto.agentId, dto.cameraId);
    const status = dto.status === AgentStatus.SYNCHRONIZING ? AgentStatus.SYNCHRONIZING : AgentStatus.ONLINE;
    const now = new Date();
    return this.prisma.$transaction(async (tx) => {
      const updatedAgent = await tx.aiAgent.update({
        where: { id: agent.agentId },
        data: { status, lastSeenAt: now }
      });
      await tx.camera.update({
        where: { id: agent.cameraId },
        data: { status: CameraStatus.ONLINE, lastSyncAt: now }
      });
      return updatedAgent;
    });
  }

  async syncEvents(agent: AuthenticatedAgent, dto: SyncEventsDto) {
    const acceptedEventIds: string[] = [];
    const duplicateEventIds: string[] = [];
    const now = new Date();

    await this.prisma.$transaction(async (tx) => {
      for (const event of dto.events) {
        this.assertAgentScope(agent, event.agentId, event.cameraId);
        if (event.storeId !== agent.storeId) {
          throw new ForbiddenException('Event store does not match authenticated AI Agent.');
        }
        try {
          await tx.visitorEvent.create({
            data: {
              id: event.id,
              storeId: event.storeId,
              cameraId: event.cameraId,
              agentId: event.agentId,
              occurredAt: new Date(event.occurredAt),
              direction: event.direction
            }
          });
          acceptedEventIds.push(event.id);
        } catch (error) {
          if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
            duplicateEventIds.push(event.id);
            acceptedEventIds.push(event.id);
            continue;
          }
          throw error;
        }
      }

      await tx.aiAgent.update({
        where: { id: agent.agentId },
        data: { status: AgentStatus.ONLINE, lastSeenAt: now }
      });
      await tx.camera.update({
        where: { id: agent.cameraId },
        data: { status: CameraStatus.ONLINE, lastSyncAt: now }
      });
    });

    return {
      message: 'Visitor events synchronized.',
      data: {
        acceptedEventIds,
        duplicateEventIds
      }
    };
  }

  async listForUser(userId: string) {
    const store = await this.storesService.findOwnedStore(userId);
    const agents = await this.prisma.aiAgent.findMany({
      where: { storeId: store.id },
      select: {
        id: true,
        storeId: true,
        cameraId: true,
        name: true,
        status: true,
        lastSeenAt: true,
        createdAt: true,
        updatedAt: true
      }
    });
    const threshold = this.config.get<number>('AGENT_OFFLINE_THRESHOLD_SECONDS', 90);
    return agents.map((agent) => ({
      ...agent,
      status: resolveAgentStatus(agent.status, agent.lastSeenAt, threshold)
    }));
  }

  private assertAgentScope(agent: AuthenticatedAgent, agentId: string, cameraId: string): void {
    if (agent.agentId !== agentId || agent.cameraId !== cameraId) {
      throw new ForbiddenException('Request does not match authenticated AI Agent.');
    }
  }
}
