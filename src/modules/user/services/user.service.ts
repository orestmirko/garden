import { Injectable } from '@nestjs/common';

import { IUserData } from '#common/models/interfaces/user-data.interface';
import { UserEntity } from '#entities/user.entity';
import { UserRepository } from '#modules/repository/services/user.repository';
import { Transactional } from '#transactions/decorators';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  @Transactional()
  public async currentUser(userData: IUserData): Promise<UserEntity> {
    return await this.userRepository.findOneBy({ id: userData.userId });
  }
}
