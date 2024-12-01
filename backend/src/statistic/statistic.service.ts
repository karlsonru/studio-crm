import { Injectable } from '@nestjs/common';
import { IFilterQuery } from '../shared/IFilterQuery';
import { AttendanceService } from '../attendance/attendance.service';
import { PaymentStatus, VisitStatus } from '../schemas/attendance.schema';
import { AttendanceModel, SubscriptionModel } from '../schemas';
import { SubscriptionService } from '../subscription/subscription.service';
import { FinanceService } from '../finance/finance.service';
import { isMongoId } from 'class-validator';

export interface IFindVisitedByStudentWithStatistic {
  attendances: Array<AttendanceModel>;
  statistic: Record<string, number>;
}

@Injectable()
export class StatisticService {
  constructor(
    private attendanceService: AttendanceService,
    private subscribtionService: SubscriptionService,
    private financeService: FinanceService,
  ) {}

  async calcVisitedLessonsByStudent(
    studentId: string,
    dateFrom: number,
  ): Promise<IFindVisitedByStudentWithStatistic> {
    const attendances = await this.attendanceService.findAll({
      $and: [{ date: { $gte: dateFrom } }, { students: { $elemMatch: { student: studentId } } }],
    });

    const statistic = {
      visited: 0,
      missed: 0,
      sick: 0,
      unpaid: 0,
    };

    attendances.forEach((visited) => {
      const visit = visited.students.find(
        (students) => students.student._id.toString() === studentId,
      );

      if (!visit) return;

      if (visit?.paymentStatus === PaymentStatus.UNPAID) {
        statistic.unpaid += 1;
      }

      switch (visit?.visitStatus) {
        case VisitStatus.VISITED:
          statistic.visited += 1;
          break;
        case VisitStatus.MISSED:
          statistic.missed += 1;
          break;
        case VisitStatus.SICK:
          statistic.sick += 1;
          break;
        default:
      }

      // оставим только одного студанта в посетивших чтобы лишний раз не фильтровать всё на FE
      visited.students = [visit];
    });

    return {
      attendances,
      statistic,
    };
  }

  async calcIncomeByLocationAndUser({
    dateFrom,
    dateTo,
    locationId,
    userId,
  }: {
    dateFrom: number;
    dateTo: number;
    locationId: string;
    userId: string;
  }) {
    const subscriptions = await this.subscribtionService.findAll({
      dateFrom: { $gte: dateFrom },
      dateTo: { $lte: dateTo },
    });

    const expenses = await this.financeService.findAll({
      date: { $gte: dateFrom, $lte: dateTo },
    });

    const statistic = {
      income: 0,
      subscriptionsAmount: 0,
      expenses: 0,
    };

    const isCheckLocation = isMongoId(locationId);
    const isFilterByUserId = isMongoId(userId);

    // найдём общий доход и кол-во абонементов по каждому месяцу
    subscriptions.forEach((subscription) => {
      if (
        isCheckLocation &&
        !subscription.lessons.some((lesson) => lesson.location._id.toString() === locationId)
      )
        return;

      if (
        isFilterByUserId &&
        // @ts-ignore
        !subscription.lessons.some((lesson) => lesson.teacher === userId)
      )
        return;

      statistic.income += subscription.price;
      statistic.subscriptionsAmount += 1;
    });

    expenses.forEach((expense) => {
      if (isCheckLocation && locationId !== expense.location?._id.toString()) return;

      statistic.expenses += expense.amount;
    });

    return statistic;
  }

  async calcIncomeByUser(filter: IFilterQuery<SubscriptionModel>, userId: string) {
    const subscriptions = await this.subscribtionService.findAll({
      dateFrom: { $gte: filter.dateFrom },
    });

    return subscriptions
      .filter((subscription) =>
        subscription.lessons?.some((lesson) => (lesson.teacher as unknown as string) === userId),
      )
      .reduce((prev, curr) => prev + curr.price, 0);
  }
}
