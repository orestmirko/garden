import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { IUserData } from '#common/models/interfaces';
import { AuthConfigService } from '#config/auth/configuration.service';
import { UnauthorizedCustomException } from '#modules/auth/exceptions';
import { TokenType } from '#modules/auth/models/enums';
import { JwtPayload } from '#modules/auth/models/interfaces';
import { TokenService } from '#modules/auth/services/token.service';
import { UserRepository } from '#modules/repository/services/user.repository';
import { UserMapper } from '#modules/user/services/user.mapper';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    private userRepository: UserRepository,
    private configService: AuthConfigService,
    private tokenService: TokenService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.refreshTokenSecret,
      ignoreExpiration: true,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JwtPayload): Promise<IUserData> {
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    await this.tokenService.validate(payload, token, TokenType.REFRESH);

    const user = await this.userRepository.findOneBy({
      id: payload.userId,
    });

    if (!user) {
      throw new UnauthorizedCustomException();
    }
    return UserMapper.toUserData(user, payload.deviceId);
  }
}
