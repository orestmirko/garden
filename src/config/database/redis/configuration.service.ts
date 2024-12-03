import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';

import configuration from './configuration';

@Injectable()
export class RedisConfigService {
  constructor(
    @Inject(configuration.KEY)
    private redisConfiguration: ConfigType<typeof configuration>,
  ) {}

  get host(): string {
    return this.redisConfiguration.host;
  }

  get port(): number {
    return Number(this.redisConfiguration.port);
  }

  get password(): string {
    return this.redisConfiguration.password;
  }
}
