import * as path from 'node:path';

import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import { PostgresqlConfigModule } from '#config/database/postgresql/config.module';
import { PostgresqlConfigService } from '#config/database/postgresql/configuration.service';
import { addTransactionalDataSource } from '#database/transaction-manager-storage';

/**
 * Class provides TypeORM configuration settings for initializing the database connection.
 */
export class TypeOrmConfigurations {
  static get config(): TypeOrmModuleAsyncOptions {
    const dbDirectory = path.join(process.cwd(), 'dist', 'src', 'database');
    return {
      imports: [PostgresqlConfigModule],
      useFactory: (configService: PostgresqlConfigService) => ({
        type: 'postgres',
        host: configService.host,
        port: configService.port,
        username: configService.user,
        password: configService.password,
        database: configService.database,
        synchronize: false,
        migrationsRun: configService.runMigrations,
        entities: [path.join(dbDirectory, 'entities', '*.entity.js')],
        migrationsTableName: 'migrations',
        migrations: [path.join(dbDirectory, 'migrations', '*.js')],
        cli: {
          migrationsDir: 'src/database/migrations',
        },
        extra: {
          max: 50,
        },
        // logging: true,
      }),
      inject: [PostgresqlConfigService],
      async dataSourceFactory(options) {
        const dataSource = new DataSource(options);
        return addTransactionalDataSource(dataSource);
      },
    };
  }
}
