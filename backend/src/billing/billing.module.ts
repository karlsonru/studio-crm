import { Module } from '@nestjs/common';
import { BillingService } from './billing.service';
import { SubscriptionModule } from '../subscription/subscription.module';

@Module({
  imports: [SubscriptionModule],
  controllers: [],
  providers: [BillingService],
  exports: [BillingService],
})
export class BillingModulde {}
