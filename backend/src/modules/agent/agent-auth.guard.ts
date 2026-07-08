import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { hashAgentToken } from '../../common/utils/token.util';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AgentAuthGuard implements CanActivate {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request & { agent?: unknown }>();
    const token = this.extractBearerToken(request);
    if (!token) {
      throw new UnauthorizedException('Missing AI Agent token.');
    }

    const apiTokenHash = hashAgentToken(
      token,
      this.config.getOrThrow<string>('AGENT_TOKEN_PEPPER')
    );
    const agent = await this.prisma.aiAgent.findUnique({ where: { apiTokenHash } });
    if (!agent) {
      throw new UnauthorizedException('Invalid AI Agent token.');
    }

    request.agent = {
      agentId: agent.id,
      storeId: agent.storeId,
      cameraId: agent.cameraId
    };
    return true;
  }

  private extractBearerToken(request: Request): string | null {
    const header = request.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
      return null;
    }
    return header.slice('Bearer '.length).trim();
  }
}
