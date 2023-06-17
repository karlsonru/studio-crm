import { Module } from '@nestjs/common';
import { VisitedLessonService } from './visited-lesson.service';
import { VisitedLessonController } from './visited-lesson.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { VisitedLessonModel, VisitedLessonSchema } from '../schemas';
import { SubscriptionModel, SubscriptionSchema } from '../schemas';
import { SubscriptionModule } from '../subscription/subscription.module';
import { BillingModulde } from '../subscription-charge/subscriptionCharge.module';

@Module({
  imports: [
    SubscriptionModule,
    BillingModulde,
    MongooseModule.forFeature([
      { name: VisitedLessonModel.name, schema: VisitedLessonSchema },
      { name: SubscriptionModel.name, schema: SubscriptionSchema },
    ]),
  ],
  controllers: [VisitedLessonController],
  providers: [VisitedLessonService],
  exports: [VisitedLessonService],
})
export class VisitedLessonModule {}
