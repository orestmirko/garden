import { IsEmail, IsNotEmpty } from 'class-validator';

export class SignInRequestDto {
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  readonly password: string;

  @IsNotEmpty()
  readonly deviceId: string;
}
