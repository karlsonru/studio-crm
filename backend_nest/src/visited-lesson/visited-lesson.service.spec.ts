import { Test, TestingModule } from '@nestjs/testing';
import { VisitedLessonService } from './visited-lesson.service';

describe('VisitedLessonService', () => {
  let service: VisitedLessonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VisitedLessonService],
    }).compile();

    service = module.get<VisitedLessonService>(VisitedLessonService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
