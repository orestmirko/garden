import { Injectable } from '@nestjs/common';

import { ConfigurationServiceStatic } from '#config/configuration.service-static';

@Injectable()
export class PostgresConfigurationServiceStatic {
  public static get host(): string {
    return ConfigurationServiceStatic.get('POSTGRES_HOST');
  }

  public static get port(): number {
    return Number(ConfigurationServiceStatic.get('POSTGRES_PORT'));
  }

  public static get user(): string {
    return ConfigurationServiceStatic.get('POSTGRES_USER');
  }

  public static get password(): string {
    return ConfigurationServiceStatic.get('POSTGRES_PASSWORD');
  }

  public static get database(): string {
    return ConfigurationServiceStatic.get('POSTGRES_DATABASE');
  }

  public static get runMigrations(): boolean {
    return ConfigurationServiceStatic.get('POSTGRES_RUN_MIGRATIONS') === 'true';
  }
}
