import { Module } from '@nestjs/common';
import { StoresModule } from '../stores/stores.module';
import { VisitorEventsController } from './visitor-events.controller';
import { VisitorEventsService } from './visitor-events.service';

@Module({
  imports: [StoresModule],
  controllers: [VisitorEventsController],
  providers: [VisitorEventsService],
  exports: [VisitorEventsService]
})
export class VisitorEventsModule {}
