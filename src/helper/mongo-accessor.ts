import {
  CollectionAggregationOptions, CollectionInsertOneOptions, CommonOptions,
  Db, FilterQuery, FindOneAndDeleteOption, FindOneAndUpdateOption,
  FindOneOptions, MongoClient, ObjectId, OrderedBulkOperation,
} from 'mongodb';
import { isEmpty, isNil } from 'lodash';

export type myObject = { [key: string]: any };

export abstract class MongoAccessor<T extends myObject> {
  static async close() {
    if (!isNil(MongoAccessor.mongoClient)) {
      const mongoClient = MongoAccessor.mongoClient;
      await mongoClient.close();
      MongoAccessor.mongoClient = undefined;
    }
  }
  private static mongoClient: MongoClient;

  protected abstract collectionName: string;

  private mongUri: string;
  private db: Db;
  private bulkOps: OrderedBulkOperation;

  constructor(mongoUri: string) {
    this.mongUri = mongoUri;
  }

  async get(
    query: FilterQuery<T>, options?: FindOneOptions<T>,
    orderField?: string | Array<[string, number]>, direction?: number,
  ) {
    await this.getDb();
    return (await this.getCursor(query, options, orderField, direction)).toArray();
  }

  async getWithCount(
    query: FilterQuery<T>, options?: FindOneOptions<T>,
    orderField?: string | Array<[string, number]>, direction?: number,
  ) {
    await this.getDb();
    const result = await this.getCursor(query, options, orderField, direction);
    return {
      data: (await result.toArray()),
      count: (await result.count()),
    };
  }

  async getOne(query: FilterQuery<T>, options?: FindOneOptions<T>,) {
    await this.getDb();
    const table = this.db.collection<T>(this.collectionName);
    return table.findOne(query, options as FindOneOptions<T extends T ? T : T>);
  }

  async getCursor(
    query: FilterQuery<T>, options?: FindOneOptions<T>,
    orderField?: string | Array<[string, number]>, direction?: number,
  ) {
    await this.getDb();
    const table = this.db.collection<T>(this.collectionName);
    if (!isEmpty(orderField)) {
      return table.find(query, options as FindOneOptions<T extends T ? T : T>).sort(orderField, direction);
    } else {
      return table.find(query, options as FindOneOptions<T extends T ? T : T>);
    }
  }

  async insertOne(fullDoc: T, options?: CollectionInsertOneOptions) {
    await this.getDb();
    const table = this.db.collection<T>(this.collectionName);
    const result = await table.insertOne(fullDoc as any, options);
    return result.ops;
  }

  async insertOneBulk(fullDoc: T) {
    await this.getDb();
    await this.initBulkOps();
    return this.bulkOps.insert(fullDoc);
  }

  async updateOne(
    doc: Partial<T>, query?: FilterQuery<T>,
    options?: FindOneAndUpdateOption<T>,
  ) {
    await this.getDb();
    const table = this.db.collection<T>(this.collectionName);
    const preQuery: FilterQuery<T> = query ? query : { _id: (doc._id || new ObjectId()) } as FilterQuery<T>;
    const result = await table.findOneAndUpdate(
      preQuery, { $set: doc }, Object.assign({ returnOriginal: true }, options));
    return result.value;
  }

  async updateMany(
    partialDoc: T, query?: FilterQuery<T>,
    options?: FindOneAndUpdateOption<T>,
  ) {
    await this.getDb();
    const table = this.db.collection<T>(this.collectionName);
    const preQuery: FilterQuery<T> = query ? query : { _id: partialDoc._id || new ObjectId() };
    const result = await table.updateMany(
      preQuery, { $set: partialDoc }, Object.assign({ returnOriginal: true }, options));
    return result.result;
  }

  async upsertOne(
    doc: T, query?: FilterQuery<T>,
    options?: FindOneAndUpdateOption<T>,
  ) {
    return this.updateOne(doc, query, Object.assign({}, options, { upsert: true }));
  }

  async updateOneBulk(
    doc: T, query: FilterQuery<T>,
  ) {
    await this.getDb();
    await this.initBulkOps();
    return this.bulkOps.find(query).updateOne(doc);
  }

  async findOneAndDelete(query: FilterQuery<T>, options?: FindOneAndDeleteOption<T>) {
    await this.getDb();
    const table = this.db.collection<T>(this.collectionName);
    return table.findOneAndDelete(query, options);
  }

  async initBulkOps() {
    if (this.bulkOps) {
      return;
    }
    await this.getDb();
    const table = this.db.collection<T>(this.collectionName);
    this.bulkOps = await table.initializeOrderedBulkOp();
  }

  async execute() {
    this.bulkOps.execute();
  }

  async deleteOne(
    query: FilterQuery<T>,
    options?: CommonOptions & { bypassDocumentValidation?: boolean },
  ) {
    await this.getDb();
    const table = this.db.collection<T>(this.collectionName);
    return table.deleteOne(query, options);
  }

  async deleteOneBulk(query: FilterQuery<T>,
  ) {
    await this.getDb();
    this.initBulkOps();
    return this.bulkOps.find(query).deleteOne();
  }

  async deleteMany(filter: FilterQuery<T>, options?: CommonOptions) {
    await this.getDb();
    const table = this.db.collection<T>(this.collectionName);
    return table.deleteMany(filter, options);
  }

  async aggregate<E>(match: { $match: T }, group: myObject, options?: CollectionAggregationOptions) {
    await this.getDb();
    const table = this.db.collection<T>(this.collectionName);
    return table.aggregate<E>([match, group], options).toArray();
  }

  async getDb() {
    if (isNil(MongoAccessor.mongoClient)) {
      MongoAccessor.mongoClient = await MongoClient.connect(this.mongUri, { useUnifiedTopology: true });
    }
    if (isNil(this.db)) {
      this.db = MongoAccessor.mongoClient.db();
    }
    return this.db;
  }

  async getCollection() {
    const db = await this.getDb();
    return db.collection<T>(this.collectionName);
  }
}

export const parseObjectId = (strObjectId: string) => {
  try {
    return new ObjectId(strObjectId);
  } catch (error) {
    console.error(error);
    throw Error(`String [${strObjectId}] is not an Object Id`);
  }
};
