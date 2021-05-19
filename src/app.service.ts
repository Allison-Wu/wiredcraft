import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  healthCheck(): string {
    // return JSON.stringify(process.env);
    return 'The wiredcraft test service is up and running!';
  }
}
