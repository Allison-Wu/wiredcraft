import { IsString } from 'class-validator';
import { ApiFieldDocValidate } from '../decorators/api-response-decorators';
import { EditableRecord } from '../helper/editable-mongo-accessor';
import { Point } from '@turf/turf';

export class User extends EditableRecord {
  @ApiFieldDocValidate('test', 'The user name')
  @IsString()
  name: string;

  @ApiFieldDocValidate('dob', 'The dob of user')
  @IsString()
  dob: string;

  @ApiFieldDocValidate({
    type: 'Point',
    coordinates: [
      113.0307213,
      28.2341038
    ]
  }, 'address')
  address?: Point;

  @ApiFieldDocValidate('description', 'The description of user')
  @IsString()
  description: string;

  cognitoId?: string;
}
