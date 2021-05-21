import * as Faker from 'faker';
import { User } from '../../src/user/user.model';
import { ObjectId } from 'mongodb';
import { Relation, RelationStatus } from 'src/relation/relation.model';

export const genUsers = (length = 1) => {
  const items: User[] = [];
  for (let i = 0; i < length; i++) {
    const item: User = {
      _id: new ObjectId(),
      name: Faker.internet.userName(),
      dob: Faker.lorem.paragraph(),
      description: Faker.lorem.paragraph(),
      address: {
        type: 'Point',
        coordinates: [Number(Faker.address.latitude()), Number(Faker.address.longitude()) ],
      },
    };
    items.push(item);
  }
  return items;
};

export const genRelations = (length = 1) => {
  const items: Relation[] = [];
  for (let i = 0; i < length; i++) {
    const item: Relation = {
      _id: new ObjectId(),
      userId: new ObjectId(),
      followingUserId: new ObjectId(),
      status: Object.values(RelationStatus.FOLLOWING)[Faker.datatype.number(4)] as RelationStatus,
    };
    items.push(item);
  }
  return items;
};