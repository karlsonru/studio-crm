import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { StatisticService } from './statistic.service';
import { ValidateIdPipe } from '../shared/validaitonPipe';
import { logger } from '../shared/logger.middleware';

@Controller('statistic')
export class StatisticController {
  constructor(private readonly statisticService: StatisticService) {}

  @Get('/visited-lessons/:studentId')
  async statVisitedLessonsByStudent(
    @Param('studentId', ValidateIdPipe) studentId: string,
    @Query('monthes') monthes?: number,
  ) {
    logger.info(
      `Получен запрос на статистику. ID студента: ${studentId}. Период в месяцах: ${monthes}.`,
    );
    const query = {
      dateFrom: 0,
    };

    if (monthes) {
      const today = new Date();
      query.dateFrom = Date.UTC(today.getFullYear(), today.getMonth() - monthes, 1);
    }

    const statistic = await this.statisticService.calcVisitedLessonsByStudent(
      studentId,
      query.dateFrom,
    );

    return statistic;
  }

  @Get('/finance/statistic/location/:locationId')
  async statFinanceCommon(
    @Param('locationId') locationId: string,
    @Query('month', ParseIntPipe) month: number,
    @Query('userId') userId: string,
  ) {
    logger.info(
      `Получен запрос на статистику. ID локации: ${locationId} месяц: ${month}. ID пользователя: ${userId}.`,
    );

    const today = new Date();

    const query = {
      locationId,
      userId,
      dateFrom: Date.UTC(today.getFullYear(), month, 1),
      dateTo: Date.UTC(today.getFullYear(), month + 1, 1),
    };

    const statistic = await this.statisticService.calcIncomeByLocationAndUser(query);

    return statistic;
  }

  @Get('/finance/income/user/:userId')
  async statFinanceIncomeByUser(
    @Query('filter') filter: string,
    @Param('userId', ValidateIdPipe) userId: string,
  ) {
    const query = JSON.parse(filter);

    const statistic = await this.statisticService.calcIncomeByUser(query, userId);

    return statistic;
  }
}
