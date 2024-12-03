import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { IUserData } from '#common/models/interfaces';

export const CurrentUser = createParamDecorator<IUserData>(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
