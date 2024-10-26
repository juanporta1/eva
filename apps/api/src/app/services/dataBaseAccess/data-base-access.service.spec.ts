import { Test, TestingModule } from '@nestjs/testing';
import { DataBaseAccessService } from './data-base-access.service';

describe('DataBaseAccessService', () => {
  let service: DataBaseAccessService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DataBaseAccessService],
    }).compile();

    service = module.get<DataBaseAccessService>(DataBaseAccessService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
