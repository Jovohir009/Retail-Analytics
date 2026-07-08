import { Type } from 'class-transformer';
import { IsArray, IsDateString, IsNotEmpty, IsString, IsUUID, ValidateNested } from 'class-validator';

export class SyncVisitorEventDto {
  @IsUUID()
  id!: string;

  @IsUUID()
  storeId!: string;

  @IsUUID()
  cameraId!: string;

  @IsUUID()
  agentId!: string;

  @IsDateString()
  occurredAt!: string;

  @IsString()
  @IsNotEmpty()
  direction!: string;
}

export class SyncEventsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SyncVisitorEventDto)
  events!: SyncVisitorEventDto[];
}
