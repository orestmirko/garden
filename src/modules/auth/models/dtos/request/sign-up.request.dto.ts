import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignUpRequestDto {
  @ApiProperty({ example: 'Андрій', description: 'User name' })
  @IsNotEmpty()
  @IsString()
  @Length(2, 20)
  @Matches(/^[a-zA-Zа-яА-ЯіІїЇєЄ'\s-]+$/, {
    message: 'Name can only contain letters, spaces, apostrophe and hyphen',
  })
  readonly name: string;

  @ApiProperty({ example: '380999999999', description: 'Phone number' })
  @IsNotEmpty()
  @IsString()
  @Length(12, 12)
  @Matches(/^380[0-9]{9}$/, {
    message: 'Phone must start with 380 and contain 9 more digits',
  })
  readonly phone: string;
} 