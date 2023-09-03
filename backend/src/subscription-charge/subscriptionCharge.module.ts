import { Module, forwardRef } from '@nestjs/common';
import { SubscriptionChargeService } from './subscriptionCharge.service';
import { SubscriptionModule } from '../subscription/subscription.module';

@Module({
  imports: [forwardRef(() => SubscriptionModule)],
  controllers: [],
  providers: [SubscriptionChargeService],
  exports: [SubscriptionChargeService],
})
export class SubscriptionChargeModulde {}
