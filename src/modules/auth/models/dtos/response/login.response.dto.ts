import { TokenResponseDto } from '#modules/auth/models/dtos/response';
import { UserResponseDto } from '#modules/user/models/dtos/response';

export class LoginResponseDto {
  tokens: TokenResponseDto;

  user: UserResponseDto;
}
