import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AgentModule } from './modules/agent/agent.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { AuthModule } from './modules/auth/auth.module';
import { CamerasModule } from './modules/cameras/cameras.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { StoresModule } from './modules/stores/stores.module';
import { UsersModule } from './modules/users/users.module';
import { VisitorEventsModule } from './modules/visitor-events/visitor-events.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          ttl: config.get<number>('THROTTLE_TTL', 60000),
          limit: config.get<number>('THROTTLE_LIMIT', 120)
        }
      ]
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    StoresModule,
    CamerasModule,
    AgentModule,
    VisitorEventsModule,
    AnalyticsModule
  ]
})
export class AppModule {}
