import { Injectable } from '@nestjs/common';
import { IFilterQuery } from '../shared/IFilterQuery';
import { VisitedLessonService } from '../visited-lesson/visited-lesson.service';
import { BillingStatus, VisitStatus } from '../schemas/visitedLesson.schema';
import { VisitedLessonModel, SubscriptionModel } from '../schemas';
import { SubscriptionService } from '../subscription/subscription.service';
import { FinanceService } from '../finance/finance.service';
import { isMongoId } from 'class-validator';

export interface IFindVisitedByStudentWithStatistic {
  visitedLessons: Array<VisitedLessonModel>;
  statistic: Record<string, number>;
}

@Injectable()
export class StatisticService {
  constructor(
    private visitedLessonsService: VisitedLessonService,
    private subscribtionService: SubscriptionService,
    private financeService: FinanceService,
  ) {}

  async calcVisitedLessonsByStudent(
    query: IFilterQuery<VisitedLessonModel>,
    studentId: string,
  ): Promise<IFindVisitedByStudentWithStatistic> {
    const visitedLessons = await this.visitedLessonsService.findAll(query);

    const statistic = {
      visited: 0,
      missed: 0,
      sick: 0,
      unpaid: 0,
    };

    visitedLessons.forEach((visited) => {
      const visit = visited.students.find(
        (students) => students.student._id.toString() === studentId,
      );

      if (!visit) return;

      if (visit?.billingStatus === BillingStatus.UNPAID) {
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
      visitedLessons,
      statistic,
    };
  }

  async calcIncome(filter: IFilterQuery<SubscriptionModel>, locationId?: string) {
    const subscriptions = await this.subscribtionService.findAll({
      dateFrom: { $gte: filter.dateFrom },
    });
    const expenses = await this.financeService.findAll({
      date: { $gte: filter.dateFrom },
    });

    const incomeByMonth: Array<number> = Array(12).fill(0);
    const amountByMonth: Array<number> = Array(12).fill(0);
    const expensesByMonth: Array<number> = Array(12).fill(0);

    const isCheckLocation = isMongoId(locationId);

    // найдём общий доход и кол-во абонементов по каждому месяцу
    subscriptions.forEach((subscription) => {
      if (isCheckLocation && locationId !== subscription.lesson.location._id.toString()) return;

      const month = new Date(subscription.dateFrom).getMonth();

      incomeByMonth[month] += subscription.template.price;
      amountByMonth[month] += 1;
    });

    expenses.forEach((expense) => {
      if (isCheckLocation && locationId !== expense.location?._id.toString()) return;

      const month = new Date(expense.date).getMonth();

      expensesByMonth[month] += expense.amount;
    });

    return {
      income: incomeByMonth,
      amount: amountByMonth,
      expenses: expensesByMonth,
    };
  }

  async calcIncomeByUser(filter: IFilterQuery<SubscriptionModel>, userId: string) {
    const subscriptions = await this.subscribtionService.findAll({
      dateFrom: { $gte: filter.dateFrom },
    });

    return subscriptions
      .filter((subscription) => (subscription.lesson?.teacher as unknown as string) === userId)
      .reduce((prev, curr) => prev + curr.template.price, 0);
  }
}
