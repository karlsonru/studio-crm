import { Module } from '@nestjs/common';
import { SubscriptionChargeService } from './subscriptionCharge.service';
import { SubscriptionModule } from '../subscription/subscription.module';

@Module({
  imports: [SubscriptionModule],
  controllers: [],
  providers: [SubscriptionChargeService],
  exports: [SubscriptionChargeService],
})
export class SubscriptionChargeModulde {}
