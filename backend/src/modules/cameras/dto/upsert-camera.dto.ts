import { CameraType } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class UpsertCameraDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEnum(CameraType)
  type!: CameraType;
}
