import { Module } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { SubscriptionController } from './subscription.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SubscriptionModel, SubscriptionSchema } from '../schemas';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: SubscriptionModel.name, schema: SubscriptionSchema }]),
  ],
  controllers: [SubscriptionController],
  providers: [SubscriptionService],
})
export class SubscriptionModule {}
