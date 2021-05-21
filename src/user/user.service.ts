import { UserModule } from './user.module';
import { ObjectId } from 'mongodb';
import { User } from './user.model';

export class UserService {
  static async findOne(id: string) {
    return UserModule.instance.getOne({ _id: new ObjectId(id) });
  }

  static async updateOne(id: ObjectId, updateDoc: User) {
    return UserModule.instance.updateOne(updateDoc, { _id: id }, { returnOriginal: false });
  }

  static async createOne(user: User) {
    const [createdResult] = await UserModule.instance.insertOne(user);
    return createdResult;
  }

  static async deleteOne(id: ObjectId) {
    return UserModule.instance.updateOne({ deleted: true }, { _id: id }, { returnOriginal: false });
  }
}