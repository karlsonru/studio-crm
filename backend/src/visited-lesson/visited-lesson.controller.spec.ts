import { Test, TestingModule } from '@nestjs/testing';
import { VisitedLessonController } from './visited-lesson.controller';
import { VisitedLessonService } from './visited-lesson.service';

describe('VisitedLessonController', () => {
  let controller: VisitedLessonController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VisitedLessonController],
      providers: [VisitedLessonService],
    }).compile();

    controller = module.get<VisitedLessonController>(VisitedLessonController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
