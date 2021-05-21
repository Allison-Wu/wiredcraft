import { UserModule } from './user.module';
import { ObjectId } from 'mongodb';
import { User } from './user.model';
import { decodeScrollId, formatScrollId } from '../helper/crypto-helper';
import { PaginationRespDTO } from 'src/app.dto';
import { NearByUserReqDTO } from './dto/user-req.dto';
import { badRequest } from 'src/middlewares/http-exception.filter';

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

  static async nearBy(query: NearByUserReqDTO) {
    const user = await UserModule.instance.getOne({ name: query.name });
    if (!user) throw badRequest('Invalid user name!');
    if (!user.address) return new PaginationRespDTO([], null, 0);

    const { skip, limit } = decodeScrollId(query.scrollId);
    const { data, count: total } = await UserModule.instance.getWithCount({
      location: {
        $nearSphere: user.address,
        // Can set the max distance if need
        // $maxDistance: 100
      }
    });

    const scrollId = formatScrollId(data, total, skip, limit);
    return new PaginationRespDTO(data, scrollId, total);
  }
}