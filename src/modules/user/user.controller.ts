import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { IUserData } from '#common/models/interfaces/user-data.interface';
import { CurrentUser } from '#modules/auth/decorators';
import { UserResponseDto } from '#modules/user/models/dtos/response/user.response.dto';
import { UserMapper } from '#modules/user/services/user.mapper';
import { UserService } from '#modules/user/services/user.service';

@ApiBearerAuth()
@ApiTags('User')
@Controller({ path: 'user', version: '1' })
export class UserController {
  constructor(private usersService: UserService) {}

  @ApiOperation({ description: 'Get current user by token' })
  @Get('me')
  public async getCurrentUser(@CurrentUser() userData: IUserData): Promise<UserResponseDto> {
    const result = await this.usersService.currentUser(userData);
    return UserMapper.toResponseDto(result);
  }
}
