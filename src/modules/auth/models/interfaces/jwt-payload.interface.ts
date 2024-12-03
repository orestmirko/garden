import { UserID } from '#entities/types';
import { UserRoleEnum } from '#modules/user/models/enums';

export interface JwtPayload {
  userId: UserID;
  deviceId: string;
}
