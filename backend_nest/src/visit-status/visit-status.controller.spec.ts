import { Test, TestingModule } from '@nestjs/testing';
import { VisitStatusController } from './visit-status.controller';
import { VisitStatusService } from './visit-status.service';

describe('VisitStatusController', () => {
  let controller: VisitStatusController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VisitStatusController],
      providers: [VisitStatusService],
    }).compile();

    controller = module.get<VisitStatusController>(VisitStatusController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
