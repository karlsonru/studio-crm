import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { logger } from '../shared/logger.middleware';
import { VisitedStudent as VisitedStudentDto } from './dto/create-attendance.dto';
import { VisitStatus, BillingStatus, VisitedStudent } from '../schemas/attendance.schema';
import { AttendanceModel, SubscriptionModel } from '../schemas';
import { SubscriptionService } from '../subscription/subscription.service';

interface IVisitedStudentDto extends Omit<VisitedStudentDto, 'subscription'> {
  subscription: string | null | SubscriptionModel;
}

interface IVisitedStudentEntity extends Omit<VisitedStudent, 'subscription'> {
  subscription: string | null;
}

interface IUpdatedVisitedStudent extends Omit<VisitedStudent, 'student'> {
  student: string;
}

interface IPrevAndUpdatedVisit {
  prevVisit: IVisitedStudentEntity | undefined;
  updatedVisit: IUpdatedVisitedStudent;
}

interface IChargeBackSubscription {
  ids: Array<string>;
  action: Record<string, number>;
}

// TODO: refactor
// SubscriptionChargeService -> AttendancePayment Service

@Injectable()
export class SubscriptionChargeService {
  constructor(
    @Inject(forwardRef(() => SubscriptionService))
    private readonly subscriptionService: SubscriptionService,
  ) {}

  assignSubscriptions(attendance: AttendanceModel, subscriptions: SubscriptionModel[]) {
    for (const visitedStudent of attendance.students) {
      switch (visitedStudent.visitStatus) {
        case VisitStatus.POSTPONED:
        case VisitStatus.VISITED:
          const subscription = subscriptions.find(
            (subscription) => subscription.student._id === visitedStudent.student._id,
          );

          // если посетил занятие или перенёс, то ищем абонемент
          visitedStudent.subscription = subscription?._id.toString() ?? null;
          break;
        // отметим только что не нужно снимать с абонемента, если visitStatus не походит для списания
        default:
          visitedStudent.subscription = null;
      }

      logger.debug(
        `Студент ${visitedStudent.student}. 
        Статус визита: ${visitedStudent.visitStatus}. 
        Статус оплаты: ${visitedStudent.billingStatus}. 
        Абонемент: ${visitedStudent.subscription ?? 'не найден'}`,
      );
    }
  }

  getBillingStatus(visitStatus: VisitStatus, isPaid: boolean): BillingStatus {
    switch (visitStatus) {
      case VisitStatus.POSTPONED:
      case VisitStatus.VISITED:
        return isPaid ? BillingStatus.PAID : BillingStatus.UNPAID;
      default:
        return BillingStatus.UNCHARGED;
    }
  }

  async findSubscription(
    studentId: string,
    lessonId: string,
    date: number,
  ): Promise<SubscriptionModel[] | null> {
    const subscription = await this.subscriptionService.findAll(
      {
        lesson: lessonId,
        student: studentId,
        visitsLeft: { $gte: 0 },
        dateTo: { $gte: date },
      },
      /*
      {
        sort: {
          visitsLeft: 1,
        },
      },
      */
    );
    return subscription;
  }

  async addSubscription(visitedStudents: IVisitedStudentDto[], lessonId: string, date: number) {
    // найдём абонементы по этому занятию
    const subscriptions = await this.subscriptionService.findAll(
      {
        $and: [
          { lesson: lessonId },
          { student: { $in: visitedStudents.map((visitedStudent) => visitedStudent.student) } },
          { visitsLeft: { $gte: 0 } },
          { dateTo: { $gte: date } },
        ],
      },
      {
        sort: {
          visitsLeft: 1,
        },
      },
    );

    logger.debug(
      `Занятие ${lessonId}. Найдено ${subscriptions.length} абонементов для ${visitedStudents.length} студентов`,
    );

    visitedStudents.forEach((visitedStudent) => {
      // отметим только что не нужно снимать с абонемента, если visitStatus не походит для списания
      switch (visitedStudent.visitStatus) {
        case VisitStatus.MISSED:
        case VisitStatus.SICK:
        case VisitStatus.UNKNOWN:
          visitedStudent.subscription = null;
          break;

        case VisitStatus.POSTPONED:
        case VisitStatus.VISITED:
          // если посетил занятие или перенёс, то ищем абонемент
          const subscription = subscriptions.find(
            (subscription) => subscription.student._id.toString() === visitedStudent.student,
          );

          visitedStudent.subscription = subscription ?? null;
          break;

        default:
      }
    });
  }

  async _addBillingStatus(visitedStudents: VisitedStudent[], lessonId: string) {
    // в зависимости от найденных абонементов - каждому студенту проставим его биллинг статус
    for (const visitedStudent of visitedStudents) {
      switch (visitedStudent.visitStatus) {
        case VisitStatus.POSTPONED:
        case VisitStatus.VISITED:
          // Если есть абонемент с которого списать - отметим что занятие оплачено
          visitedStudent.billingStatus = visitedStudent.subscription
            ? BillingStatus.PAID
            : BillingStatus.UNPAID;
          break;
        // отметим только что не нужно снимать с абонемента, если visitStatus не походит для списания
        default:
          visitedStudent.billingStatus = BillingStatus.UNCHARGED;
      }

      logger.debug(
        `Занятие: ${lessonId}. Студент ${visitedStudent.student}. 
        Статус визита: ${visitedStudent.visitStatus}. 
        Статус оплаты: ${visitedStudent.billingStatus}. 
        Абонемент: ${visitedStudent.subscription ?? 'не найден'}`,
      );
    }
  }

  async addBillingStatus(visitedStudents: IVisitedStudentDto[], lessonId: string) {
    // в зависимости от найденных абонементов - каждому студенту проставим его биллинг статус
    visitedStudents.forEach((visitedStudent) => {
      // костыль с typeguards
      if (typeof visitedStudent.subscription === 'string') return;

      // отметим только что не нужно снимать с абонемента, если visitStatus не походит для списания
      switch (visitedStudent.visitStatus) {
        case VisitStatus.MISSED:
        case VisitStatus.SICK:
        case VisitStatus.UNKNOWN:
          visitedStudent.billingStatus = BillingStatus.UNCHARGED;
          break;

        case VisitStatus.POSTPONED:
        case VisitStatus.VISITED:
          // Если есть абонемент с которого списать - отметим что занятие оплачено
          if (visitedStudent.subscription && visitedStudent.subscription.visitsLeft > 0) {
            visitedStudent.billingStatus = BillingStatus.PAID;
          } else {
            // Иначе не оплачено
            visitedStudent.billingStatus = BillingStatus.UNPAID;
          }
          break;

        default:
      }

      logger.debug(
        `Занятие: ${lessonId}. Студент ${visitedStudent.student}. 
        Статус визита: ${visitedStudent.visitStatus}. 
        Статус оплаты: ${visitedStudent.billingStatus}. 
        Абонемент (осталось занятий): ${visitedStudent.subscription?.visitsLeft ?? 'не найден'}`,
      );
    });
  }

  async _chargeSubscriptions(visitedStudents: VisitedStudent[], lessonId: string) {
    // спишем по одному занятию из списка оставшихся у тех, у кого статус оплачено
    const studentsPaidIds = visitedStudents
      .filter((visitedStudent) => visitedStudent.billingStatus === BillingStatus.PAID)
      .map((visitedStudent) => visitedStudent.subscription);

    if (studentsPaidIds.length) {
      logger.debug(`
        Занятие ${lessonId}. Списание оплаченных занятий у ${studentsPaidIds.length} студентов.
      `);

      await this.subscriptionService.updateMany(
        { _id: { $in: studentsPaidIds } },
        { $inc: { visitsLeft: -1 } },
      );
    }

    const studentsPaidAndPostponedIds = visitedStudents
      .filter(
        (visitedStudent) =>
          visitedStudent.billingStatus === BillingStatus.PAID &&
          visitedStudent.visitStatus === VisitStatus.POSTPONED,
      )
      .map((visitedStudent) => visitedStudent.subscription);

    // дополнительно отметим перенесённое занятие у тех у кого оплачено
    if (studentsPaidAndPostponedIds.length) {
      logger.debug(`
        Занятие ${lessonId}. Перенос занятий у ${studentsPaidIds.length} студентов.
      `);

      await this.subscriptionService.updateMany(
        { _id: { $in: studentsPaidAndPostponedIds } },
        { $inc: { visitsPostponed: 1 } },
      );
    }
  }

  async chargeSubscriptions(visitedStudents: VisitedStudentDto[], lessonId: string) {
    // спишем по одному занятию из списка оставшихся у тех, у кого статус оплачено

    const studentsPaidIds = visitedStudents
      .filter((visitedStudent) => visitedStudent.billingStatus === BillingStatus.PAID)
      .map((visitedStudent) => visitedStudent.subscription);

    if (studentsPaidIds.length) {
      logger.debug(`
        Занятие ${lessonId}. Списание оплаченных занятий у ${studentsPaidIds.length} студентов.
      `);

      await this.subscriptionService.updateMany(
        { _id: { $in: studentsPaidIds } },
        { $inc: { visitsLeft: -1 } },
      );
    }

    const studentsPaidAndPostponedIds = visitedStudents
      .filter(
        (visitedStudent) =>
          visitedStudent.billingStatus === BillingStatus.PAID &&
          visitedStudent.visitStatus === VisitStatus.POSTPONED,
      )
      .map((visitedStudent) => visitedStudent.subscription);

    // дополнительно отметим перенесённое занятие у тех у кого оплачено
    if (studentsPaidAndPostponedIds.length) {
      logger.debug(`
        Занятие ${lessonId}. Перенос занятий у ${studentsPaidIds.length} студентов.
      `);

      await this.subscriptionService.updateMany(
        { _id: { $in: studentsPaidAndPostponedIds } },
        { $inc: { visitsPostponed: 1 } },
      );
    }
  }

  async changeBillingStatus(
    updatedVisitedStudents: VisitedStudentDto[],
    attendance: AttendanceModel,
  ) {
    logger.debug(
      `Посещённое занятие: ${attendance._id}. Проверяем обновлённый список посетивших студентов`,
    );

    // проверим списки студентов и найдём отличающуюся информацию
    const studentsWithChangedStatuses = this.compareVisits(updatedVisitedStudents, attendance);

    if (!studentsWithChangedStatuses.length) return;
    logger.debug(`
      Посещённое занятие: ${attendance._id}. Изменился статус у ${studentsWithChangedStatuses.length} студентов. 
    `);

    // возвращаем все изменения в абонементах сделанные по прошлому занятию обратно
    await this.chargeBackSubscriptions(studentsWithChangedStatuses);

    const updatedStudents = studentsWithChangedStatuses.map(
      (prevAndNextVisit) => prevAndNextVisit.updatedVisit,
    );
    const sourceLessonId = attendance.lesson._id.toString();

    // найдём абонемент с которого списать
    await this.addSubscription(updatedStudents, sourceLessonId, attendance.date);

    // добавим биллинг статус
    await this.addBillingStatus(updatedStudents, sourceLessonId);

    // конвертируем объекты с подписками в обычные текстовые строки с id
    this.normalizeSubscriptionIds(updatedStudents);

    // спишем занятие
    await this.chargeSubscriptions(updatedStudents, sourceLessonId);
  }

  compareVisits(updatedVisitedStudents: VisitedStudentDto[], attendance: AttendanceModel) {
    const studentsWithChangedStatuses: Array<IPrevAndUpdatedVisit> = [];

    updatedVisitedStudents.forEach((updatedVisitedStudent) => {
      const previousVisit = attendance.students.find(
        (visitedStudent) => visitedStudent.student._id.toString() === updatedVisitedStudent.student,
      );

      // ничего не делаем, если статус визита не измениля
      if (updatedVisitedStudent.visitStatus === previousVisit?.visitStatus) return;

      // если нет предыдущего визита для этого студента - то это новый студент, ранее не отмечался
      if (!previousVisit) {
        logger.debug(
          `Посещённое занятие: ${attendance._id}. Новый студент ${updatedVisitedStudent.student}`,
        );
      }

      // !!! здесь subscription превращается в subscriptionEntity ?
      if (previousVisit?.subscription) {
        // @ts-ignore
        previousVisit.subscription = previousVisit?.subscription._id;
      }

      studentsWithChangedStatuses.push({
        prevVisit: previousVisit,
        updatedVisit: updatedVisitedStudent,
      });

      logger.debug(`
        Посещённое занятие: ${attendance._id}. Изменился статус студента ${updatedVisitedStudent.student}. 
        Прошлый статус: ${previousVisit?.visitStatus}. Новый статус: ${updatedVisitedStudent.visitStatus}.        
      `);
    });

    return studentsWithChangedStatuses;
  }

  normalizeSubscriptionIds(visitedStudents: IVisitedStudentDto[]) {
    visitedStudents.forEach((visitedStudent) => {
      if (!visitedStudent.subscription || typeof visitedStudent.subscription === 'string') return;

      visitedStudent.subscription = visitedStudent.subscription._id.toString();
    });
  }

  async chargeBackSubscriptions(studentsWithChangedStatuses: Array<IPrevAndUpdatedVisit>) {
    const increaseVisitsLeft: IChargeBackSubscription = {
      ids: [],
      action: { visitsLeft: 1 },
    };
    const deductPostponedVisits: IChargeBackSubscription = {
      ids: [],
      action: { visitsPostponed: -1 },
    };
    const increasePostponedVisits: IChargeBackSubscription = {
      ids: [],
      action: { visitsPostponed: 1 },
    };

    studentsWithChangedStatuses.forEach((prevAndUpdatedVisit) => {
      const { prevVisit } = prevAndUpdatedVisit;

      // если у нас нет абонемента на предыдущее занятие или с него не было списания - то искать разницу не нужно
      if (!prevVisit?.subscription || prevVisit.billingStatus !== BillingStatus.PAID) return;

      // смотрим какой был статус и какой новый
      switch (prevVisit.visitStatus) {
        // если старый статус не подразуемвал списания - то ничего не делаем
        case VisitStatus.MISSED:
        case VisitStatus.SICK:
        case VisitStatus.UNKNOWN:
          break;

        // если ранее был статус ПЕРЕНЕСЁН - вернём списанное и отложенное занятие
        case VisitStatus.POSTPONED:
          increaseVisitsLeft.ids.push(prevVisit.subscription);
          deductPostponedVisits.ids.push(prevVisit.subscription);
          break;

        // если старый статус ПОСЕТИЛ вернём ему списанное занятие
        case VisitStatus.VISITED:
          increaseVisitsLeft.ids.push(prevVisit.subscription);
          break;
      }
    });

    // по полученным спискам ID абонементов где есть отличия пройдём по всем и внесём изменения в абонементы
    [increaseVisitsLeft, deductPostponedVisits, increasePostponedVisits].forEach(async (change) => {
      if (!change.ids.length) return;

      const updatedResult = await this.subscriptionService.updateMany(
        { _id: { $in: change.ids } },
        { $inc: change.action },
      );

      logger.debug(
        `У ${change.ids.length} студентов выполнено действие ${change.action}. Обновлено ${updatedResult.modifiedCount} документов`,
      );
    });
  }
}
