import { RelationModule } from './relation.module';
import { ObjectId } from 'mongodb';
import { RelationReqDTO } from './dto/relation-req.dto';
import { decodeFromBase64, encodeToBase64 } from '../helper/crypto-helper';
import { RelationStatus } from './relation.model';
import { PaginationRespDTO } from 'src/app.dto';
import _ from 'lodash';
import { RelationRespDTO } from './dto/relation-resp.dto';

const defaultLimit = 30;

const formatScrollId = (data: RelationRespDTO[], total: number, skip = 0, limit = defaultLimit) => {
  if ((skip + data.length) >= total) {
    return null;
  } else {
    return encodeToBase64({ skip: skip + limit, limit });
  }
};

export class RelationService {
  static async findAllFollower(query: RelationReqDTO, requestUserId: ObjectId) {
    const { skip, limit } = decodeFromBase64(query.scrollId, { skip: 0, limit: defaultLimit });

    const { data: followerRelations, count: total } = await RelationModule.instance.getWithCount(
      { followingUserId: new ObjectId(query.userId) || requestUserId, status: RelationStatus.FOLLOWING }, { skip, limit },
    );
    
    const dataRelations = await RelationModule.instance.get(
      {
        userId: requestUserId,
        followingUserId: { $in: _.map(followerRelations, 'userId') },
      }, { skip, limit },
    );

    const data = await Promise.all<RelationRespDTO>(
      _.map(followerRelations, async followerRelation => {
        const followerId = followerRelation.userId;
        const relation = _.find(dataRelations, { followingUserId: followerId });
        return RelationModule.toPublicObject(followerId, relation?.status);
      })
    );
      
    const scrollId = formatScrollId(data, total, skip, limit);
    return new PaginationRespDTO(data, scrollId, total);
  }

  static async findAllFollowing(query: RelationReqDTO, requestUserId: ObjectId) {
    const defaultLimit = 30;
    const { skip, limit } = decodeFromBase64(query.scrollId, { skip: 0, limit: defaultLimit });
    const { data: followingRelations, count: total } = await RelationModule.instance.getWithCount(
      { userId: new ObjectId(query.userId) || requestUserId, status: RelationStatus.FOLLOWING }, { skip, limit },
    );

    const isSelfFollowing = followingRelations[0]?.userId === requestUserId;
    const dataRelations = !isSelfFollowing && await RelationModule.instance.get(
      {
        followingUserId: requestUserId,
        userId: { $in: _.map(followingRelations, 'followingUserId') },
      }, { skip, limit },
    );

    const data = await Promise.all<RelationRespDTO>(
      _.map(followingRelations, async followingRelation => {
        const followingUserId = followingRelation.followingUserId;

        if (isSelfFollowing) {
          return RelationModule.toPublicObject(followingUserId, followingRelation.status);
        } else {
          const relation = _.find(dataRelations, { userId: followingUserId });
          return RelationModule.toPublicObject(followingUserId, relation?.status);
        }
      })
    );

    const scrollId = formatScrollId(data, total, skip, limit);
    return new PaginationRespDTO(data, scrollId, total);
  }
}