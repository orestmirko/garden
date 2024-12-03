import { UserRoleEnum, UserStatusEnum } from '#modules/user/models/enums';

export class UserResponseDto {
  id: string;

  firstName: string;

  lastName: string;

  phone?: string;

  birthday?: string;

  email: string;

  status: UserStatusEnum;

  role: UserRoleEnum;
}
