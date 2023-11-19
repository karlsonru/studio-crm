import { PartialType } from '@nestjs/swagger';
import { CreateFinanceDto } from './create-finance.dto';

export class UpdateFinanceDto extends PartialType(CreateFinanceDto) {}
