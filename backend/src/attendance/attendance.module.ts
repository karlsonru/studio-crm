import { Module } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { AttendanceController } from './attendance.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  AttendanceModel,
  AttendanceSchema,
  SubscriptionModel,
  SubscriptionSchema,
} from '../schemas';
import { SubscriptionModule } from '../subscription/subscription.module';
import { SubscriptionChargeModulde } from '../subscription-charge/subscriptionCharge.module';
import { LessonModule } from '../lesson/lesson.module';

@Module({
  imports: [
    SubscriptionModule,
    SubscriptionChargeModulde,
    LessonModule,
    MongooseModule.forFeature([
      { name: AttendanceModel.name, schema: AttendanceSchema },
      { name: SubscriptionModel.name, schema: SubscriptionSchema },
    ]),
  ],
  controllers: [AttendanceController],
  providers: [AttendanceService],
  exports: [AttendanceService],
})
export class AttendanceModule {}
