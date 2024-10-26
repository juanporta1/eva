import { Test, TestingModule } from '@nestjs/testing';
import { EvaService } from './eva.service';

describe('EvaService', () => {
  let service: EvaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EvaService],
    }).compile();

    service = module.get<EvaService>(EvaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
