import { Module } from '@nestjs/common';
import { StatisticService } from './statistic.service';
import { StatisticController } from './statistic.controller';
import { VisitedLessonModule } from '../visited-lesson/visited-lesson.module';
import { SubscriptionModule } from '../subscription/subscription.module';

@Module({
  imports: [VisitedLessonModule, SubscriptionModule],
  controllers: [StatisticController],
  providers: [StatisticService],
})
export class StatisticModule {}
