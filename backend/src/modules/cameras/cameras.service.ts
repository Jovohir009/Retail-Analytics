import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StoresService } from '../stores/stores.service';
import { UpsertCameraDto } from './dto/upsert-camera.dto';

@Injectable()
export class CamerasService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storesService: StoresService
  ) {}

  async listForUser(userId: string) {
    const store = await this.storesService.findOwnedStore(userId);
    return this.prisma.camera.findMany({
      where: { storeId: store.id, deletedAt: null },
      orderBy: { createdAt: 'asc' }
    });
  }

  async createForUser(userId: string, dto: UpsertCameraDto) {
    const store = await this.storesService.findOwnedStore(userId);
    return this.prisma.camera.create({
      data: {
        storeId: store.id,
        name: dto.name,
        type: dto.type
      }
    });
  }

  async updateForUser(userId: string, cameraId: string, dto: UpsertCameraDto) {
    await this.ensureOwnedCamera(userId, cameraId);
    return this.prisma.camera.update({ where: { id: cameraId }, data: dto });
  }

  async ensureOwnedCamera(userId: string, cameraId: string) {
    const store = await this.storesService.findOwnedStore(userId);
    const camera = await this.prisma.camera.findFirst({
      where: { id: cameraId, storeId: store.id, deletedAt: null }
    });
    if (!camera) {
      throw new NotFoundException('Camera not found.');
    }
    return camera;
  }
}
