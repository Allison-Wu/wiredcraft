import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { RelationController } from './relation/relation.controller';
import { UserController } from './user/user.controller';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get('health')
  getHello(): string {
    return this.appService.healthCheck();
  }
}

export const allControllers = [ AppController, UserController, RelationController ];
