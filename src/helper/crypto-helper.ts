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
