import { IsString } from 'class-validator';
import { PaginationReqDTO } from '../../app.dto';
import { ApiFieldDocValidate } from '../../decorators/api-response-decorators';

export class RelationReqDTO extends PaginationReqDTO {
  @ApiFieldDocValidate('ObjectId("603cb5c5d7afac001e7f6f0f")', 'The user id')
  @IsString()
  userId: string;
}