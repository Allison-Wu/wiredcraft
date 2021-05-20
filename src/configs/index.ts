import { LogLevel } from '../helper/logger';
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

export const awsRegion = process.env.AWS_REGION;
export const cognitoUserPoolId = process.env.COGNITO_POOL_ID;

export const logLevel = process.env.LOG_LEVEL || (stage === 'prd' ? LogLevel.info : LogLevel.debug);