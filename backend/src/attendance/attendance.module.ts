import { Module, forwardRef } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { AttendanceController } from './attendance.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AttendanceModel, AttendanceSchema } from '../schemas';
import { LessonModule } from '../lesson/lesson.module';
import { SubscriptionModule } from '../subscription/subscription.module';
import { SubscriptionChargeService } from './subscriptionCharge.service';

@Module({
  imports: [
    LessonModule,
    forwardRef(() => SubscriptionModule),
    MongooseModule.forFeature([{ name: AttendanceModel.name, schema: AttendanceSchema }]),
  ],
  controllers: [AttendanceController],
  providers: [AttendanceService, SubscriptionChargeService],
  exports: [AttendanceService],
})
export class AttendanceModule {}
