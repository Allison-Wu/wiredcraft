import { EditableMongoAccessor } from '../helper/editable-mongo-accessor';
import { Logger } from '../helper/logger';
import { mongoUri } from '../configs';
import { Relation, RelationStatus } from './relation.model';
import { ObjectId } from 'mongodb';
import { UserModule } from '../user/user.module';
import { RelationRespDTO } from './dto/relation-resp.dto';

export class RelationModule extends EditableMongoAccessor<Relation> {
  protected collectionName = 'relation';

  static get instance() {
    if (!relationModule) {
      Logger.info('create relationModule when it is empty.');
    }
    relationModule ??= new RelationModule(mongoUri);
    relationModule.initOperator('relation service');
    return relationModule;
  }

  static async toPublicObject(userId: ObjectId, status = RelationStatus.NOT_FOLLOWING): Promise<RelationRespDTO> {
    const user = await UserModule.instance.getOne({ _id: userId });
    return Object.assign({}, user, { status });
  }
}

let relationModule: RelationModule;
