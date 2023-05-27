import { Injectable } from '@nestjs/common';
import { IFilterQuery } from '../shared/IFilterQuery';
import { VisitedLessonEntity } from '../visited-lesson/entities/visited-lesson.entity';
import { VisitedLessonService } from '../visited-lesson/visited-lesson.service';
import { BillingStatus, VisitStatus } from '../schemas/visitedLesson.schema';

export interface IFindVisitedByStudentWithStatistic {
  visitedLessons: Array<VisitedLessonEntity>;
  statistic: Record<string, number>;
}

@Injectable()
export class StatisticService {
  constructor(private visitedLessonsService: VisitedLessonService) {}

  async calcVisitedLessonsByStudent(
    query: IFilterQuery<VisitedLessonEntity>,
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
}
