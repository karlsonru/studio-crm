import { Module, forwardRef } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { SubscriptionController } from './subscription.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SubscriptionModel, SubscriptionSchema } from '../schemas';
import { AttendanceModule } from '../attendance/attendance.module';

@Module({
  imports: [
    forwardRef(() => AttendanceModule),
    MongooseModule.forFeature([{ name: SubscriptionModel.name, schema: SubscriptionSchema }]),
  ],
  controllers: [SubscriptionController],
  providers: [SubscriptionService],
  exports: [SubscriptionService],
})
export class SubscriptionModule {}
