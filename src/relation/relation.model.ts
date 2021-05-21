import { ObjectId } from 'aws-sdk/clients/codecommit';
import { IsString } from 'class-validator';
import { ApiFieldDocValidate } from '../decorators/api-response-decorators';
import { EditableRecord } from '../helper/editable-mongo-accessor';

export enum RelationStatus {
  NOT_FOLLOWING = 'NOT FOLLOWING',
  FOLLOWING = 'FOLLOWING',
  PENDING = 'PENDING',
  REJECTED = 'REJECTED',
}

export class Relation extends EditableRecord {
  @ApiFieldDocValidate('ObjectId("603cb5c5d7afac001e7f6f0f")', 'The user id for follower')
  userId: ObjectId;

  @ApiFieldDocValidate('ObjectId("603cb5c5d7afac001e7f6f0a")', 'The user id for followee')
  @IsString()
  followingUserId: ObjectId;

  @ApiFieldDocValidate('address', 'The address of user')
  @IsString()
  status: RelationStatus;
}
