import { Query } from '@nestjs/common';
import { ApiAllInOne, ApiAllInOneWithPagination, HTTPMethod } from '../decorators/api-response-decorators';
import { ApiDocAndRoute } from '../decorators/common-decorators';
import { RelationReqDTO } from './dto/relation-req.dto';
import { RelationRespDTO } from './dto/relation-resp.dto';
import { RelationService } from './relation.service';
import { ObjectId } from 'mongodb';
import { User } from '../decorators/user.decorator';

@ApiDocAndRoute('relation')
export class RelationController {
  @ApiAllInOneWithPagination(
    'Get follower list by user id',
    'Return the followers of user.',
    RelationRespDTO, HTTPMethod.GET, 'followers'
  )
  async findAllFollower(
    @Query() query: RelationReqDTO,
    @User('_id') requestUserId: ObjectId,
  ) {
    return RelationService.findAllFollower(query, requestUserId);
  }

  @ApiAllInOneWithPagination(
    'Get following list by user id',
    'Return the followings of user.',
    RelationRespDTO, HTTPMethod.GET, 'followings'
  )
  async findAllFollowing(
    @Query() query: RelationReqDTO,
    @User('_id') requestUserId: ObjectId,
  ) {
    return RelationService.findAllFollowing(query, requestUserId);
  }

}
