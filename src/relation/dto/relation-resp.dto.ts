import { IntersectionType, PickType } from '@nestjs/swagger';
import { User } from '../../user/user.model';
import { Relation } from '../relation.model';

export class RelationRespDTO extends IntersectionType(User, PickType(Relation, ['status'])) {}