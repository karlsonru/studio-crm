import { Module } from '@nestjs/common';
import { LessonService } from './lesson.service';
import { LessonController } from './lesson.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { LessonModel, LessonSchema } from '../schemas/lesson.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: LessonModel.name, schema: LessonSchema }])],
  controllers: [LessonController],
  providers: [LessonService],
})
export class LessonModule {}
