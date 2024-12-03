import * as path from 'node:path';

import { DataSourceOptions } from 'typeorm';

import { PostgresConfigurationServiceStatic } from '#config/database/postgresql/configuration.service-static';

/**
 * Class provides static TypeORM configuration settings for initializing the database connection.
 */
export class TypeOrmConfigurationStatic {
  static get config(): DataSourceOptions {
    const dbPath = path.join(process.cwd(), 'src', 'database');

    return {
      type: 'postgres',
      host: PostgresConfigurationServiceStatic.host,
      port: PostgresConfigurationServiceStatic.port,
      username: PostgresConfigurationServiceStatic.user,
      password: PostgresConfigurationServiceStatic.password,
      database: PostgresConfigurationServiceStatic.database,
      entities: [path.join(dbPath, 'entities', '*.entity.ts')],
      migrations: [path.join(dbPath, 'migrations', '*.ts')],
      synchronize: false,
    };
  }
}
