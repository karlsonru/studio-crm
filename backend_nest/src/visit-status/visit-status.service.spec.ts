import { Test, TestingModule } from '@nestjs/testing';
import { VisitStatusService } from './visit-status.service';

describe('VisitStatusService', () => {
  let service: VisitStatusService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VisitStatusService],
    }).compile();

    service = module.get<VisitStatusService>(VisitStatusService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
