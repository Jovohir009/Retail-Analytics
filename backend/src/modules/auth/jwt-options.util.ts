import { ConfigService } from '@nestjs/config';
import { SignOptions } from 'jsonwebtoken';

export function jwtExpiresIn(config: ConfigService): SignOptions['expiresIn'] {
  return config.get<string>('JWT_EXPIRES_IN', '15m') as SignOptions['expiresIn'];
}
