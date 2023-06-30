import { Module } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { AttendanceController } from './attendance.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AttendanceModel, AttendanceSchema } from '../schemas';
import { SubscriptionModel, SubscriptionSchema } from '../schemas';
import { SubscriptionModule } from '../subscription/subscription.module';
import { BillingModulde } from '../subscription-charge/subscriptionCharge.module';

@Module({
  imports: [
    SubscriptionModule,
    BillingModulde,
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
