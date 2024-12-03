import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthConfigModule } from '#config/auth/config.module';
import { AuthConfigService } from '#config/auth/configuration.service';
import { AuthController } from '#modules/auth/auth.controller';
import { AccessTokenGuard } from '#modules/auth/guards';
import { AuthService } from '#modules/auth/services/auth.service';
import { TokenService } from '#modules/auth/services/token.service';
import { TokenStorageService } from '#modules/auth/services/token-storage.service';
import { JwtAccessStrategy, JwtRefreshStrategy, LocalStrategy } from '#modules/auth/strategies';
import { RedisModule } from '#modules/redis/redis.module';

const JwtFactory = (config: AuthConfigService) => ({
  secret: config.accessTokenSecret,
  signOptions: {
    expiresIn: config.accessTokenExpiration,
  },
});

const JwtRegistrationOptions = {
  imports: [AuthConfigModule],
  useFactory: JwtFactory,
  inject: [AuthConfigService],
};

const AppGuardProvider = {
  provide: APP_GUARD,
  useClass: AccessTokenGuard,
};
@Module({
  imports: [
    AuthConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync(JwtRegistrationOptions),
    RedisModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtAccessStrategy,
    JwtRefreshStrategy,
    TokenService,
    TokenStorageService,
    AppGuardProvider,
  ],
  exports: [PassportModule, AuthService],
})
export class AuthModule {}
