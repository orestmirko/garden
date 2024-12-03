import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { IUserData } from '#common/models/interfaces';
import { UnauthorizedCustomException } from '#modules/auth/exceptions';
import { SignInRequestDto } from '#modules/auth/models/dtos/request';
import { UserRepository } from '#modules/repository/services/user.repository';
import { UserMapper } from '#modules/user/services/user.mapper';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private userRepository: UserRepository) {
    super({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
    });
  }

  async validate(
    { body }: { body: SignInRequestDto },
    email: string,
    password: string,
  ): Promise<IUserData> {
    const user = await this.userRepository.authorize(email, password);
    if (!user) {
      throw new UnauthorizedCustomException();
    }
    return UserMapper.toUserData(user, body.deviceId);
  }
}
