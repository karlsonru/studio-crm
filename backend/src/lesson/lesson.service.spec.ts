import { Test, TestingModule } from '@nestjs/testing';
import { LessonService } from './lesson.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Lesson, LessonSchema } from '../schemas';

describe('LessonService', () => {
  let service: LessonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MongooseModule.forFeature([{ name: Lesson.name, schema: LessonSchema }])],
      providers: [LessonService],
    }).compile();

    // service = module.get<LessonService>(LessonService);
    service = await module.resolve(LessonService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
