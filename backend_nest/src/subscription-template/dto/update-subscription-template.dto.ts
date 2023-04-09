import { PartialType } from '@nestjs/mapped-types';
import { CreateSubscriptionTemplateDto } from './create-subscription-template.dto';

export class UpdateSubscriptionTemplateDto extends PartialType(CreateSubscriptionTemplateDto) {}
