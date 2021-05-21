import { isEmpty } from 'lodash';

export const decodeFromBase64 = <T = any>(value: string, defaultObject: T) => {
  try {
    if (isEmpty(value)) {
      return defaultObject;
    }
    return JSON.parse(Buffer.from(value, 'base64').toString('utf8')) as T;
  } catch (error) {
    console.error(error);
    return defaultObject;
  }
};

export const encodeToBase64 = (value: any) => Buffer.from(JSON.stringify(value)).toString('base64');

export const formatScrollId = (data: any[], total: number, skip = 0, limit = 30) => {
  if ((skip + data.length) >= total) {
    return null;
  } else {
    return encodeToBase64({ skip: skip + limit, limit });
  }
};

export const decodeScrollId = (scrollId) => decodeFromBase64(scrollId, { skip: 0, limit: 30 });
