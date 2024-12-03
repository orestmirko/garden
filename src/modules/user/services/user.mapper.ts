import { IUserData } from '#common/models/interfaces/user-data.interface';
import { UserEntity } from '#database/entities/user.entity';
import { UserResponseDto } from '#modules/user/models/dtos/response/user.response.dto';

export class UserMapper {
  public static toResponseDto(entity: UserEntity): any {
    return {
      id: entity.id,
    };
  }

  public static toUserData(entity: UserEntity, deviceId: string): any {
    return {
      userId: entity.id,
      deviceId,
    };
  }
}
