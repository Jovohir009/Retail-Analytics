import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface AuthenticatedAgent {
  agentId: string;
  storeId: string;
  cameraId: string;
}

export const CurrentAgent = createParamDecorator(
  (_data: unknown, context: ExecutionContext): AuthenticatedAgent =>
    context.switchToHttp().getRequest<{ agent: AuthenticatedAgent }>().agent
);
