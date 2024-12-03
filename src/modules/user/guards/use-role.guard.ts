import { applyDecorators, UseGuards } from '@nestjs/common';

import { RolesGuard } from '#modules/user/guards/roles.guard';
import { UserRoleEnum } from '#modules/user/models/enums';

export const UseRoleGuard = (...allowedRoles: UserRoleEnum[]) => {
  return applyDecorators(UseGuards(RolesGuard(allowedRoles)));
};
