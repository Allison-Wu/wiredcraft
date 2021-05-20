import {
  CollectionInsertOneOptions, FilterQuery,
  FindOneAndUpdateOption, ObjectId, ReplaceOneOptions,
} from 'mongodb';
import dayjs from 'dayjs';

import { MongoAccessor } from './mongo-accessor';
import { ApiProperty } from '@nestjs/swagger';

export abstract class EditableMongoAccessor<T extends EditableRecord> extends MongoAccessor<T> {
  private operator: string;

  constructor(mongoUri: string, operator = 'unknown') {
    super(mongoUri);
    this.operator = operator;
  }

  initOperator(operator = 'unknown', operatorId = '') {
    this.operator = operator + operatorId;
  }

  async insertOne(fullDoc: T, options?: CollectionInsertOneOptions) {
    fullDoc.createdBy ??= this.operator;
    fullDoc.deleted = false;
    fullDoc.createdAt ??= dayjs().unix();
    return super.insertOne(fullDoc, options);
  }

  async insertOneBulk(fullDoc: T) {
    fullDoc.createdBy ??= this.operator;
    fullDoc.deleted = false;
    fullDoc.createdAt ??= dayjs().unix();
    return super.insertOneBulk(fullDoc);
  }

  async updateOne(
    doc: Partial<T>, query: FilterQuery<T>,
    options?: FindOneAndUpdateOption<T>,
  ) {
    doc.updatedBy ??= this.operator;
    doc.updatedAt ??= dayjs().unix();
    return super.updateOne(doc, query, options);
  }

  async updateMany(
    partialDoc: T, query: FilterQuery<T>,
    options?: FindOneAndUpdateOption<T>,
  ) {
    partialDoc.updatedBy ??= this.operator;
    partialDoc.updatedAt ??= dayjs().unix();
    return super.updateMany(partialDoc, query, options);
  }

  async updateOneBulk(
    doc: T, query: FilterQuery<T>,
  ) {
    doc.updatedBy ??= this.operator;
    doc.updatedAt ??= dayjs().unix();
    return super.updateOneBulk(doc, query);
  }

  async softDeleteOne(
    doc: T, query: FilterQuery<T>,
    options?: ReplaceOneOptions,
  ) {
    doc.deleted = true;
    doc.updatedBy ??= this.operator;
    doc.updatedAt ??= dayjs().unix();
    return super.updateOne(doc, query, options);
  }

  async softDeleteOneBulk(
    doc: T, query: FilterQuery<T>,
  ) {
    doc.deleted = true;
    doc.updatedBy ??= this.operator;
    doc.updatedAt ??= dayjs().unix();
    return super.updateOneBulk({
      deleted: true,
      updatedAt: dayjs().unix(),
      updatedBy: doc.updatedBy,
    } as T, query);
  }
}

export class EditableRecord {
  @ApiProperty({
    example: 'ObjectId("603cb5c5d7afac001e7f6f0f")',
    description: 'record id'
  })
  _id?: ObjectId;

  deleted?: boolean;
  createdAt?: number;
  createdBy?: string;
  updatedAt?: number;
  updatedBy?: string;
}
