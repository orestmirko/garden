import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppConfigModule } from '#config/app/config.module';
import { TypeOrmConfigurations } from '#config/database/postgresql/type-orm-configuration';
import { AuthModule } from '#modules/auth/auth.module';
import { HealthModule } from '#modules/health/health.module';
import { RepositoryModule } from '#modules/repository/repository.module';
import { UserModule } from '#modules/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync(TypeOrmConfigurations.config),
    AuthModule,
    RepositoryModule,
    AppConfigModule,
    UserModule,
    HealthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
