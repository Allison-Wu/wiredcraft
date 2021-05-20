import { Request, Response, NextFunction } from 'express';
import { pick } from 'lodash';
import { Logger } from '../helper/logger';

export const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req.path !== '/health') {
    Logger.info(pick(req, [
      'ip', 'subdomains', 'path',
      'hostname', 'headers', 'query',
      'url', 'baseUrl', 'params'
    ]));
  }
  next();
};
