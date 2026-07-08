import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateStoreDto } from './dto/update-store.dto';

@Injectable()
export class StoresService {
  constructor(private readonly prisma: PrismaService) {}

  async findOwnedStore(userId: string) {
    const store = await this.prisma.store.findFirst({
      where: { ownerId: userId, deletedAt: null }
    });
    if (!store) {
      throw new NotFoundException('Store not found.');
    }
    return store;
  }

  async updateOwnedStore(userId: string, dto: UpdateStoreDto) {
    const store = await this.findOwnedStore(userId);
    return this.prisma.store.update({
      where: { id: store.id },
      data: dto
    });
  }
}
