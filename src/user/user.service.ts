import { UserModule } from './user.module';
import { ObjectId } from 'mongodb';

export class UserService {
  static async findOne(id: string) {
    return UserModule.instance.getOne({ _id: new ObjectId(id) });
  }
}