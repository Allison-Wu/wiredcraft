import { EditableMongoAccessor } from 'src/helper/editable-mongo-accessor';
import { Logger } from 'src/helper/logger';
import { mongoUri } from '../configs';
import { User } from './user.model';

export class UserModule extends EditableMongoAccessor<User> {
  protected collectionName = 'user';

  static get instance() {
    if (!userModule) {
      Logger.info('create UserModule when it is empty.');
    }
    userModule ??= new UserModule(mongoUri);
    userModule.initOperator('user service');
    return userModule;
  }
}

let userModule: UserModule;
