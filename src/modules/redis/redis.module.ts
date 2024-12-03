import { Module } from '@nestjs/common';
import { Provider } from '@nestjs/common/interfaces/modules/provider.interface';
import { Redis } from 'ioredis';

import { RedisConfigModule } from '#config/database/redis/config.module';
import { RedisConfigService } from '#config/database/redis/configuration.service';
import { REDIS_CLIENT } from '#modules/redis/models/constants';
import { RedisSetService } from '#modules/redis/redis-set.service';

const redisProvider: Provider = {
  provide: REDIS_CLIENT,
  useFactory: (redisConfig: RedisConfigService) =>
    new Redis({
      host: redisConfig.host,
      port: redisConfig.port,
      password: redisConfig.password,
    }),
  inject: [RedisConfigService],
};

@Module({
  imports: [RedisConfigModule],
  providers: [redisProvider, RedisSetService],
  exports: [RedisSetService],
})
export class RedisModule {}
