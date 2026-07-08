import { Module } from '@nestjs/common';
import { CamerasModule } from '../cameras/cameras.module';
import { StoresModule } from '../stores/stores.module';
import { AgentAuthGuard } from './agent-auth.guard';
import { AgentController } from './agent.controller';
import { AgentService } from './agent.service';

@Module({
  imports: [StoresModule, CamerasModule],
  controllers: [AgentController],
  providers: [AgentService, AgentAuthGuard],
  exports: [AgentService]
})
export class AgentModule {}
