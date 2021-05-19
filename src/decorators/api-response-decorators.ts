/* eslint-disable @typescript-eslint/ban-types */
import {
  All, Delete, Get, Head, Options,
  Patch, Post, Put, Type,
  UseGuards, applyDecorators,
} from '@nestjs/common';
import { ApiExtraModels, ApiOperation, ApiProperty, ApiResponse, ApiResponseOptions, getSchemaPath } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { PaginationRespDTO } from 'src/app.dto';

export enum HTTPMethod {
  DELETE = 'DELETE',
  GET = 'GET',
  HEAD = 'HEAD',
  OPTIONS = 'OPTIONS',
  PATCH = 'PATCH',
  POST = 'POST',
  PUT = 'PUT',
  ALL = 'ALL'
}

export const httpMethodsMapper: Map<HTTPMethod, (path?: string | string[]) => MethodDecorator> = new Map();

httpMethodsMapper.set(HTTPMethod.DELETE, Delete);
httpMethodsMapper.set(HTTPMethod.GET, Get);
httpMethodsMapper.set(HTTPMethod.HEAD, Head);
httpMethodsMapper.set(HTTPMethod.OPTIONS, Options);
httpMethodsMapper.set(HTTPMethod.PATCH, Patch);
httpMethodsMapper.set(HTTPMethod.POST, Post);
httpMethodsMapper.set(HTTPMethod.PUT, Put);
httpMethodsMapper.set(HTTPMethod.ALL, All);

export const ApiAllInOne = (
  operationSummary: string,
  respDesc: string,
  type: Type<unknown> | Function | [Function] | string,
  httpMethod = HTTPMethod.GET,
  path?: string | string[],
  shouldAuth = true,
  responseStatus = 200,
  ...decorators: (ClassDecorator | MethodDecorator | PropertyDecorator)[]
) => {
  // if (shouldAuth) decorators.push(UseGuards(AuthGuard));
  return applyDecorators(
    httpMethodsMapper.get(httpMethod)(path),
    ApiOperation({ summary: operationSummary }),
    ApiResponse({
      type,
      status: responseStatus,
      description: respDesc,
    }),
    ...decorators,
  );
};

export const ApiAllInOneWithPagination = <TModel extends Type<any>>(
  operationSummary: string,
  respDesc: string,
  type: TModel,
  httpMethod = HTTPMethod.GET,
  path?: string | string[],
  shouldAuth = true,
  ...decorators: (ClassDecorator | MethodDecorator | PropertyDecorator)[]
) => {
  // if (shouldAuth) decorators.push(UseGuards(AuthGuard));
  const options: ApiResponseOptions = {
    status: 200,
    description: respDesc,
  };
  return applyDecorators(
    httpMethodsMapper.get(httpMethod)(path),
    ApiExtraModels(PaginationRespDTO, type),
    ApiOperation({ summary: operationSummary }),
    ApiResponse({
      ...options,
      schema: {
        allOf: [
          { $ref: getSchemaPath(PaginationRespDTO) },
          {
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(type) },
              },
            },
          },
        ],
      },
    }),
    ...decorators,
  );
};

export const ApiFieldDocValidate = (
  example?: any,
  description?: string,
  required = false,
  type?: Type<unknown> | Function | [Function] | string,
  ...decorators: (ClassDecorator | MethodDecorator | PropertyDecorator)[]
) => {
  const requireDecorators: MethodDecorator[] = [];
  requireDecorators.push(ApiProperty({ example, description, required, type }));
  if (!required) {
    requireDecorators.push(IsOptional());
  }
  return applyDecorators(
    ...requireDecorators,
    ...decorators,
  );
};