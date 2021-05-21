import * as Axios from 'axios';
import * as Lru from 'lru-cache';
import * as _ from 'lodash';
import * as dayjs from 'dayjs';
import * as jwkToPem from 'jwk-to-pem';
import * as jwt from 'jsonwebtoken';
import { User } from '../user/user.model';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { ObjectId } from 'mongodb';
import { Logger } from '../helper/logger';
import { unauthorized } from '../middlewares/http-exception.filter';
import { awsRegion, cognitoUserPoolId } from '../configs';

export interface IAuthoredRequest extends Request{
  user?: User;
}

export interface IDecodedCognito {
  header: {
      kid: string;
      alg: string;
  };
  payload: {
      sub: string;
      event_id: string;
      token_use: string;
      scope: string;
      auth_time: number;
      iss: string;
      exp: number;
      iat: number;
      jti: string;
      client_id: string;
      username: string;
  };
  signature: string;
}

const jwkCache = new Lru<string, any>({
  // one hour
  maxAge: 1000 * 60 * 60,
  updateAgeOnGet: false,
});

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const request: IAuthoredRequest = context.switchToHttp().getRequest<Request>();

    try {
      if (request.headers['api-authorization'] && request.headers['user-id']) {
        // space for internal auth verify
        const userId = request.headers['user-id'];
        request.user = await UserModule.instance.getOne({ _id: new ObjectId(userId), deleted: false });
        return true;
      }

      if (request.headers['authorization']) {
        const { cognitoId } = await this.validateAuthorization(request.headers['authorization']);
        request.user = await UserModule.instance.getOne({ cognitoId, deletedAt: null });
        return true;
      }
    } catch (error) {
      Logger.error(error);
      throw unauthorized(error.message);
    }
  }

  private async validateAuthorization (authorization: string) {
    if (!authorization) throw new Error(`Authorization[${authorization}] is empty.`);
  
    const token = authorization.replace(/^Bearer\s/, '');
    const decodedJwt = jwt.decode(token, { complete: true }) as IDecodedCognito;
    if (!decodedJwt) throw new Error('Invalid jwt.');

    if (dayjs().isAfter(dayjs.unix(decodedJwt.payload.exp))) {
      throw Error(`Token expired at ${decodedJwt.payload.exp}`);
    }
  
    const jwks = await this.getCognitoJwks(cognitoUserPoolId);
    const jwk = _.find((jwks).keys, { kid: decodedJwt.header.kid });
    if (!jwk) throw new Error('Jwk not found');
  
    const pem = jwkToPem(jwk);
    const cognitoId = await new Promise<string>((resolve, reject) => {
      jwt.verify(token, pem, (err, decodedToken) => {
        if (err) reject( new Error(`Jwt verify failed. Error: ${err}`));
        resolve(decodedToken.sub);
      });
    });
    return { cognitoId };
  }

  private async getCognitoJwks(cognitoPoolId: string) {
    const cacheKey = `cognito-jwks-${cognitoPoolId}`;
  
    const cacheJwks = jwkCache.get(cacheKey);
    if (cacheJwks) return cacheJwks;
  
    const { data: jwks } = await Axios.default.get(
      `https://cognito-idp.${awsRegion}.amazonaws.com/${cognitoPoolId}/.well-known/jwks.json`
    );
    jwkCache.set(cacheKey, jwks);
    return jwks;
  }
}
