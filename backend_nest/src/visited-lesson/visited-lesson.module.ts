import { Module } from '@nestjs/common';
import { VisitedLessonService } from './visited-lesson.service';
import { VisitedLessonController } from './visited-lesson.controller';

@Module({
  controllers: [VisitedLessonController],
  providers: [VisitedLessonService]
})
export class VisitedLessonModule {}
