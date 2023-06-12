import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FinanceService } from './finance.service';
import { FinanceController } from './finance.controller';
import { FinanceModel, FinanceSchema } from '../schemas';

@Module({
  imports: [MongooseModule.forFeature([{ name: FinanceModel.name, schema: FinanceSchema }])],
  controllers: [FinanceController],
  providers: [FinanceService],
  exports: [FinanceService],
})
export class FinanceModule {}
