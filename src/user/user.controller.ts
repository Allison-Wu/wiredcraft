import { Body, Param } from '@nestjs/common';
import { ApiAllInOne, HTTPMethod } from 'src/decorators/api-response-decorators';

import { ApiDocAndRoute } from 'src/decorators/common-decorators';
import { User as UserType } from './user.model';
import { UserService } from './user.service';

@ApiDocAndRoute('user')
export class UserController {
  @ApiAllInOne(
    'Get user details by user id',
    'Return the details of user.',
    UserType, HTTPMethod.GET, ':id'
  )
  async getOne(
    @Param('id') id: string,
  ) {
    return UserService.findOne(id);
  }
}
