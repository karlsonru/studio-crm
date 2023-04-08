import { PartialType } from '@nestjs/swagger';
import { CreateVisitStatusDto } from './create-visit-status.dto';

export class UpdateVisitStatusDto extends PartialType(CreateVisitStatusDto) {}
