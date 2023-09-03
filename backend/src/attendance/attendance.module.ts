import { Module, forwardRef } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { AttendanceController } from './attendance.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AttendanceModel, AttendanceSchema } from '../schemas';
import { SubscriptionChargeModulde } from '../subscription-charge/subscriptionCharge.module';
import { LessonModule } from '../lesson/lesson.module';

@Module({
  imports: [
    forwardRef(() => SubscriptionChargeModulde),
    LessonModule,
    MongooseModule.forFeature([{ name: AttendanceModel.name, schema: AttendanceSchema }]),
  ],
  controllers: [AttendanceController],
  providers: [AttendanceService],
  exports: [AttendanceService],
})
export class AttendanceModule {}
