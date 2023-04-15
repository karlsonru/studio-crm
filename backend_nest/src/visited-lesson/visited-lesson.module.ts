import { Module } from '@nestjs/common';
import { VisitedLessonService } from './visited-lesson.service';
import { VisitedLessonController } from './visited-lesson.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { VisitedLesson, VisitedLessonSchema } from '../schemas/visitedLesson.schema';
import { Subscription, SubscriptionSchema } from '../schemas/subscription.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: VisitedLesson.name, schema: VisitedLessonSchema },
      { name: Subscription.name, schema: SubscriptionSchema },
    ]),
  ],
  controllers: [VisitedLessonController],
  providers: [VisitedLessonService],
})
export class VisitedLessonModule {}
