import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateStoreDto } from './dto/update-store.dto';
import { StoresService } from './stores.service';

@UseGuards(JwtAuthGuard)
@Controller('stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Get('current')
  current(@CurrentUser() user: { userId: string }) {
    return this.storesService.findOwnedStore(user.userId);
  }

  @Patch('current')
  update(@CurrentUser() user: { userId: string }, @Body() dto: UpdateStoreDto) {
    return this.storesService.updateOwnedStore(user.userId, dto);
  }
}
