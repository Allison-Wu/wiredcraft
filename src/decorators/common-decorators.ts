import { applyDecorators, Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

export const ApiDocAndRoute = (routeName: string) => {
  return applyDecorators(
    Controller(routeName),
    ApiTags(routeName),
    ApiBearerAuth(),
  );
};