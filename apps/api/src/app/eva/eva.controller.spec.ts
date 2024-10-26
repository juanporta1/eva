import { Test, TestingModule } from '@nestjs/testing';
import { EvaController } from './eva.controller';

describe('EvaController', () => {
  let controller: EvaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EvaController],
    }).compile();

    controller = module.get<EvaController>(EvaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
