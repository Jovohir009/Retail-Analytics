import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StoresService } from '../stores/stores.service';

@Injectable()
export class VisitorEventsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storesService: StoresService
  ) {}

  async listForUser(userId: string, from?: Date, to?: Date) {
    const store = await this.storesService.findOwnedStore(userId);
    return this.prisma.visitorEvent.findMany({
      where: {
        storeId: store.id,
        occurredAt: {
          gte: from,
          lte: to
        }
      },
      orderBy: { occurredAt: 'desc' },
      take: 500
    });
  }
}
