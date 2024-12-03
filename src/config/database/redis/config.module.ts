import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { RedisConfigService } from '#config/database/redis/configuration.service';

import configuration from './configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
  ],
  providers: [ConfigService, RedisConfigService],
  exports: [RedisConfigService],
})
export class RedisConfigModule {}
