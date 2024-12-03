import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';

import { IsValidPassword } from '#modules/auth/decorators/is-valid-password.decorator';
import { UserRoleEnum } from '#modules/user/models/enums';

export class UserCreateRequestDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsValidPassword()
  password: string;

  @IsNotEmpty()
  @IsEnum(UserRoleEnum)
  role: UserRoleEnum;
}
