import { AgentStatus } from '@prisma/client';
import { IsEnum, IsUUID } from 'class-validator';

export class HeartbeatDto {
  @IsUUID()
  agentId!: string;

  @IsUUID()
  cameraId!: string;

  @IsEnum(AgentStatus)
  status!: AgentStatus;
}
