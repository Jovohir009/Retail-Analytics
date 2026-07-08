import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CamerasService } from './cameras.service';
import { UpsertCameraDto } from './dto/upsert-camera.dto';

@UseGuards(JwtAuthGuard)
@Controller('cameras')
export class CamerasController {
  constructor(private readonly camerasService: CamerasService) {}

  @Get()
  list(@CurrentUser() user: { userId: string }) {
    return this.camerasService.listForUser(user.userId);
  }

  @Post()
  create(@CurrentUser() user: { userId: string }, @Body() dto: UpsertCameraDto) {
    return this.camerasService.createForUser(user.userId, dto);
  }

  @Patch(':cameraId')
  update(
    @CurrentUser() user: { userId: string },
    @Param('cameraId') cameraId: string,
    @Body() dto: UpsertCameraDto
  ) {
    return this.camerasService.updateForUser(user.userId, cameraId, dto);
  }
}
