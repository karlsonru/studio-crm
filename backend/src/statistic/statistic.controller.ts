import { Controller, Get, Param, Query } from '@nestjs/common';
import { StatisticService } from './statistic.service';
import { ValidateIdPipe } from '../shared/validaitonPipe';

@Controller('statistic')
export class StatisticController {
  constructor(private readonly statisticService: StatisticService) {}

  @Get('/visited-lessons/:studentId')
  async statVisitedLessonsByStudent(
    @Query('filter') filter: string,
    @Param('studentId', ValidateIdPipe) studentId: string,
  ) {
    const query = JSON.parse(filter);

    const statistic = await this.statisticService.calcVisitedLessonsByStudent(query, studentId);

    return {
      message: 'success',
      payload: statistic,
    };
  }

  @Get('/finance/income/:locationId')
  async statFinanceIncome(
    @Query('filter') filter: string,
    @Param('locationId') locationId: string,
  ) {
    const query = JSON.parse(filter);

    const statistic = await this.statisticService.calcIncome(query, locationId);

    return {
      message: 'success',
      payload: statistic,
    };
  }

  @Get('/finance/outcome/:locationId')
  async statFinanceOutcome(
    @Query('filter') filter: string,
    @Param('locationId') locationId: string,
  ) {
    const query = JSON.parse(filter);

    const statistic = await this.statisticService.calcOutcome(query, locationId);

    return {
      message: 'success',
      payload: statistic,
    };
  }
}
