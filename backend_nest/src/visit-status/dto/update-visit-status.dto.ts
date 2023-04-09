import { PartialType } from '@nestjs/mapped-types';
import { CreateVisitStatusDto } from './create-visit-status.dto';

export class UpdateVisitStatusDto extends PartialType(CreateVisitStatusDto) {}
