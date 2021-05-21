import { IsString } from 'class-validator';
import { PaginationReqDTO } from '../../app.dto';
import { ApiFieldDocValidate } from '../../decorators/api-response-decorators';

export class NearByUserReqDTO extends PaginationReqDTO {
  @ApiFieldDocValidate('test', 'The user name', true)
  @IsString()
  name: string;
}