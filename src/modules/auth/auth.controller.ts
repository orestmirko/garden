import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { IUserData } from '#common/models/interfaces';
import { CurrentUser, SkipAuth } from '#modules/auth/decorators';
import { LocalAuthGuard, RefreshTokenGuard } from '#modules/auth/guards';
import { SignInRequestDto } from '#modules/auth/models/dtos/request';
import { LoginResponseDto, TokenResponseDto } from '#modules/auth/models/dtos/response';
import { AuthService } from '#modules/auth/services/auth.service';
import { SignUpRequestDto } from '#modules/auth/models/dtos/request/sign-up.request.dto';

@ApiTags('Auth')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private authService: AuthService) {}

  // @SkipAuth()
  // @UseGuards(LocalAuthGuard)
  // @ApiOperation({ description: 'User authentication' })
  // @Post('sign-in')
  // async signIn(
  //   @CurrentUser() userData: IUserData,
  //   @Body() dto: SignInRequestDto,
  // ): Promise<LoginResponseDto> {
  //   return await this.authService.login(userData, dto);
  // }

  // @SkipAuth()
  // @UseGuards(RefreshTokenGuard)
  // @ApiBearerAuth()
  // @ApiOperation({ description: 'Renew access in the application' })
  // @Post('refresh')
  // async refresh(@CurrentUser() userData: IUserData): Promise<TokenResponseDto> {
  //   return await this.authService.refresh(userData);
  // }

  // @ApiBearerAuth()
  // @ApiOperation({ description: 'Logout from current device' })
  // @Post('logout')
  // async logout(@CurrentUser() userData: IUserData): Promise<void> {
  //   await this.authService.logout(userData);
  // }

  @SkipAuth()
  @ApiOperation({ description: 'User registration' })
  @Post('sign-up')
  async signUp(@Body() dto: SignUpRequestDto): Promise<void> {
    return await this.authService.signUp(dto);
  }
}
