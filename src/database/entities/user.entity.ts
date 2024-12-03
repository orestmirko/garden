import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { TableNameEnum } from '#entities/enums';
import { BaseEntity } from '#entities/models';
import { UserID } from '#entities/types';
import { UserRoleEnum, UserStatusEnum } from '#modules/user/models/enums';

@Entity(TableNameEnum.USERS)
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: UserID;

  @Column('text')
  name: string;

  @Column('text', { unique: true, nullable: false })
  phone: string;
}
