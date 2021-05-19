import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();
  });

  describe('getHello', () => {
    it('should return "The wiredcraft test service is up and running!"', () => {
      const appController = app.get<AppController>(AppController);
      expect(appController.getHello()).toBe('The wiredcraft test service is up and running!');
    });
  });
});
