import { Module } from '@nestjs/common';
import { StoresModule } from '../stores/stores.module';
import { CamerasController } from './cameras.controller';
import { CamerasService } from './cameras.service';

@Module({
  imports: [StoresModule],
  controllers: [CamerasController],
  providers: [CamerasService],
  exports: [CamerasService]
})
export class CamerasModule {}
