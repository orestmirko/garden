import { IsNotEmpty, IsString } from 'class-validator';

export class ValidateTokenRequestDto {
  @IsString()
  @IsNotEmpty()
  readonly token: string;
}
