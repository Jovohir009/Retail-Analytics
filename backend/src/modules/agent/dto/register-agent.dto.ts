import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class RegisterAgentDto {
  @IsUUID()
  cameraId!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;
}
