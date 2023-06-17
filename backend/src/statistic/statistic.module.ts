import { Module } from '@nestjs/common';
import { StatisticService } from './statistic.service';
import { StatisticController } from './statistic.controller';
import { VisitedLessonModule } from '../visited-lesson/visited-lesson.module';
import { SubscriptionModule } from '../subscription/subscription.module';
import { FinanceModule } from '../finance/finance.module';

@Module({
  imports: [VisitedLessonModule, SubscriptionModule, FinanceModule],
  controllers: [StatisticController],
  providers: [StatisticService],
})
export class StatisticModule {}
