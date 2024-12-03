import { CanActivate, ExecutionContext } from '@nestjs/common';

import { UserRoleEnum } from '#modules/user/models/enums';

export const RolesGuard = (roles: UserRoleEnum[]) => {
  class RolesGuardClass implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
      const request = context.switchToHttp().getRequest();
      return roles?.some((role) => role === request.user.role);
    }
  }
  return RolesGuardClass;
};
