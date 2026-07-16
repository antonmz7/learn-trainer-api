import { Test, TestingModule } from '@nestjs/testing';

import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let controller: AppController;
  let service: AppService;

  beforeEach(async () => {
    const mockAppService = {
      getHealth: jest.fn().mockReturnValue({
        status: 'ok',
        version: '1.2.3',
        uptime: 42,
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: mockAppService,
        },
      ],
    }).compile();

    controller = module.get<AppController>(AppController);
    service = module.get<AppService>(AppService);
  });

  describe('getHealth', () => {
    it('делегирует вызов сервису и возвращает его результат', () => {
      const result = controller.getHealth();

      expect(service.getHealth).toHaveBeenCalledTimes(1);

      expect(result).toEqual({
        status: 'ok',
        version: '1.2.3',
        uptime: 42,
      });
    });
  });
});
