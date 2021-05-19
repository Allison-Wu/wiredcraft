import {
  Logger as WinstonLogger,
  createLogger, format,
} from 'winston';
import { logLevel, logTransports } from '../configs';

import { Format } from 'logform';
import { Writable } from 'stream';
import { id } from 'cls-rtracer';
import { isNil } from 'lodash';

// to avoid circular import
export const enum LogLevel {
  error = 'error',
  warn = 'warn',
  info = 'info',
  http = 'http',
  verbose = 'verbose',
  debug = 'debug',
  silly = 'silly',
}

export declare class Transport extends Writable {
  public format?: Format;
  public level?: string;
  public silent?: boolean;
  public handleExceptions?: boolean;

  constructor(opts?: ITransportOptions);

  public log?(info: any, next: () => void): any;
  public logv?(info: any, next: () => void): any;
  public close?(): void;
}

export interface ITransportOptions {
  format?: Format;
  level?: string;
  silent?: boolean;
  handleExceptions?: boolean;

  log?(info: any, next: () => void): any;
  logv?(info: any, next: () => void): any;
  close?(): void;
}

export interface ILogConfig {
  transports: Transport[];
  level: LogLevel;
}

export interface ILog {
  id: string;
  app: string;
  type?: LogLevel;
  additionInfo?: any;
  message?: string;
  stack?: string;
  createAt: Date;
}

const defaultFormat = format.combine(
  format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss',
  }),
  format.errors({ stack: true }),
  format.splat(),
  format.json()
);

export class Logger {
  private static winstonLogger: WinstonLogger;

  static resetLevel(newLevel: LogLevel) {
    this.logger.level = newLevel;
  }

  static warn(message: any) {
    this.logger.warn({ id: id(), message });
  }

  static error(error: Error) {
    (error as any).id = id();
    this.logger.error(error);
  }

  static info(message: any) {
    this.logger.info({ id: id(), message });
  }

  static debug(message: any) {
    this.logger.debug({ id: id(), message });
  }

  static get logger() {
    if (isNil(Logger.winstonLogger)) {
      Logger.winstonLogger = createLogger({
        level: logLevel,
        format: defaultFormat,
        transports: logTransports,
        defaultMeta: { service: `${process.env.SERVICE || 'unknown'} service` },
        exitOnError: false,
      });
    }
    return Logger.winstonLogger;
  }
}
