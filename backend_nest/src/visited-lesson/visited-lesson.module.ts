import { Module } from '@nestjs/common';
import { VisitedLessonService } from './visited-lesson.service';
import { VisitedLessonController } from './visited-lesson.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { VisitedLesson, VisitedLessonSchema } from '../schemas';

@Module({
  imports: [MongooseModule.forFeature([{ name: VisitedLesson.name, schema: VisitedLessonSchema }])],
  controllers: [VisitedLessonController],
  providers: [VisitedLessonService],
})
export class VisitedLessonModule {}
