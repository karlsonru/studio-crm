import { Injectable } from '@nestjs/common';
import { IFilterQuery } from '../shared/IFilterQuery';
import { VisitedLessonService } from '../visited-lesson/visited-lesson.service';
import { BillingStatus, VisitStatus } from '../schemas/visitedLesson.schema';
import { VisitedLessonModel, SubscriptionModel } from '../schemas';
import { SubscriptionService } from '../subscription/subscription.service';

export interface IFindVisitedByStudentWithStatistic {
  visitedLessons: Array<VisitedLessonModel>;
  statistic: Record<string, number>;
}

@Injectable()
export class StatisticService {
  constructor(
    private visitedLessonsService: VisitedLessonService,
    private subscribtionService: SubscriptionService,
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

    const incomeByMonth: Record<number, number> = {};
    const amountByMonth: Record<number, number> = {};

    // найдём общий доход и кол-во абонементов по каждому месяцу
    subscriptions.forEach((subscription) => {
      if (locationId && locationId !== subscription.lesson.location._id.toString()) return;

      const month = new Date(subscription.dateFrom).getMonth();

      if (month in incomeByMonth) {
        incomeByMonth[month] += subscription.template.price;
      } else {
        incomeByMonth[month] = subscription.template.price;
      }

      if (month in amountByMonth) {
        amountByMonth[month] += 1;
      } else {
        amountByMonth[month] = 1;
      }
    });

    // сортируем по возрастанию - последние месяцы будут в конце
    const incomeKeys = Object.keys(incomeByMonth).sort((a, b) => +a - +b);
    const amountKeys = Object.keys(amountByMonth).sort((a, b) => +a - +b);

    return {
      income: incomeKeys.map((key) => incomeByMonth[+key]),
      amount: amountKeys.map((key) => amountByMonth[+key]),
    };
  }

  async calcExpenses(filter: IFilterQuery<SubscriptionModel>, locationId?: string) {}
}
