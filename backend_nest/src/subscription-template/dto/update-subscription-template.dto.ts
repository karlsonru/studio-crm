import { PartialType } from '@nestjs/swagger';
import { CreateSubscriptionTemplateDto } from './create-subscription-template.dto';

export class UpdateSubscriptionTemplateDto extends PartialType(CreateSubscriptionTemplateDto) {}
