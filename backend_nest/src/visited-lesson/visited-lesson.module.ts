import { Module } from '@nestjs/common';
import { VisitedLessonService } from './visited-lesson.service';
import { VisitedLessonController } from './visited-lesson.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { VisitedLessonModel, VisitedLessonSchema } from '../schemas/visitedLesson.schema';
import { SubscriptionModel, SubscriptionSchema } from '../schemas/subscription.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: VisitedLessonModel.name, schema: VisitedLessonSchema },
      { name: SubscriptionModel.name, schema: SubscriptionSchema },
    ]),
  ],
  controllers: [VisitedLessonController],
  providers: [VisitedLessonService],
})
export class VisitedLessonModule {}
