import { Module } from '@nestjs/common';
import { StatisticService } from './statistic.service';
import { StatisticController } from './statistic.controller';
import { AttendanceModule } from '../attendance/attendance.module';
import { SubscriptionModule } from '../subscription/subscription.module';
import { FinanceModule } from '../finance/finance.module';

@Module({
  imports: [AttendanceModule, SubscriptionModule, FinanceModule],
  controllers: [StatisticController],
  providers: [StatisticService],
})
export class StatisticModule {}
