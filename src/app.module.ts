import { Module } from '@nestjs/common';

import { allControllers } from './app.controller';
import { AppService } from './app.service';

@Module({
  controllers: allControllers,
  providers: [AppService],
})
export class AppModule { }
