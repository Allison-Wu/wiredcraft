import { IsString } from 'class-validator';
import { ApiFieldDocValidate } from 'src/decorators/api-response-decorators';
import { EditableRecord } from 'src/helper/editable-mongo-accessor';

export class User extends EditableRecord {
  @ApiFieldDocValidate('test', 'The user name')
  @IsString()
  name: string;

  @ApiFieldDocValidate('dob', 'The dob of user')
  @IsString()
  dob: string;

  @ApiFieldDocValidate('address', 'The address of user')
  @IsString()
  address: string;

  @ApiFieldDocValidate('description', 'The description of user')
  @IsString()
  description: string;
}
