import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { CryptoHelper } from '#common/helpers';
import { UserEntity } from '#entities/user.entity';

@Injectable()
export class UserRepository extends Repository<UserEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(UserEntity, dataSource.manager);
  }

  public async authorize(email: string, password: string): Promise<UserEntity> {
    const queryBuilder = this.createQueryBuilder('user')
      .where('user.email = :email', { email })
      .andWhere('user.password = :password', {
        password: CryptoHelper.hashPassword(password),
      });

    return await queryBuilder.getOne();
  }
}
