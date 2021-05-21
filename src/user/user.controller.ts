import { Body, Param, Query } from '@nestjs/common';
import { ApiAllInOne, ApiAllInOneWithPagination, HTTPMethod } from '../decorators/api-response-decorators';

import { ApiDocAndRoute } from '../decorators/common-decorators';
import { User } from '../decorators/user.decorator';
import { User as UserType } from './user.model';
import { UserService } from './user.service';
import { ObjectId } from 'mongodb';
import { NearByUserReqDTO } from './dto/user-req.dto';

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

  @ApiAllInOne(
    'Create user',
    'Created user.',
    UserType, HTTPMethod.POST
  )
  // We use the cognito sdk to sign up in front end.
  // So I just save the info in the database like the cognito trigger.
  async createOne(
    @Body() body: UserType,
  ) {
    return UserService.createOne(body);
  }

  @ApiAllInOne(
    'Update user details by auth',
    'Return the updated details of user.',
    UserType, HTTPMethod.PUT
  )
  async updateOne(
    @User('_id') userId: ObjectId,
    @Body() body: UserType,
  ) {
    return UserService.updateOne(userId, body);
  }

  @ApiAllInOne(
    'Delete user by auth',
    'Deleted user.',
    UserType, HTTPMethod.DELETE
  )
  async deleteOne(
    @User('_id') userId: ObjectId,
  ) {
    return UserService.deleteOne(userId);
  }

  @ApiAllInOneWithPagination(
    'Get near by list by user name',
    'Return the near by list.',
    UserType, HTTPMethod.GET, 'nearby'
  )
  async findAllFollower(
    @Query() query: NearByUserReqDTO,
  ) {
    return UserService.nearBy(query);
  }
}
