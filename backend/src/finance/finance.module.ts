import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FinanceService } from './finance.service';
import { FinanceController } from './finance.controller';
import {
  FinanceModel,
  FinanceSchema,
  FinanceCategoryModel,
  FinanceCategorySchema,
} from '../schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FinanceModel.name, schema: FinanceSchema },
      { name: FinanceCategoryModel.name, schema: FinanceCategorySchema },
    ]),
  ],
  controllers: [FinanceController],
  providers: [FinanceService],
  exports: [FinanceService],
})
export class FinanceModule {}
