import { Module } from '@nestjs/common';
import { SubscriptionTemplateService } from './subscription-template.service';
import { SubscriptionTemplateController } from './subscription-template.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SubscriptionTemplate, SubscriptionTemplateSchema } from 'src/schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: SubscriptionTemplate.name,
        schema: SubscriptionTemplateSchema,
      },
    ]),
  ],
  controllers: [SubscriptionTemplateController],
  providers: [SubscriptionTemplateService],
})
export class SubscriptionTemplateModule {}
