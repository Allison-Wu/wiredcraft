import { transports } from 'winston';

export enum Environments {
  tst = 'tst',
  stg = 'stg',
  prd = 'prd'
}

export const mongoUri = process.env.MONGO_URI;

export const stage = process.env.STAGE as Environments || Environments.tst;

export const logTransports = [new transports.Console()];

export const newrelicKey = process.env.NEW_RELIC_KEY;