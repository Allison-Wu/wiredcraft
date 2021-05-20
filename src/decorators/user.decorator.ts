import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { badRequest } from '../middlewares/http-exception.filter';

export const User = createParamDecorator((field: string, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  if (!!req.user) {
    return !!field ? req.user[field] : req.user;
  }
  throw badRequest('User is not able fetch from request');
});
