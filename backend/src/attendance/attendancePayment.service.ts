import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { logger } from '../shared/logger.middleware';
import { VisitedStudent as VisitedStudentDto } from './dto/create-attendance.dto';
import { VisitStatus, PaymentStatus, VisitedStudent } from '../schemas/attendance.schema';
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
export class AttendancePaymentService {
  constructor(
    @Inject(forwardRef(() => SubscriptionService))
    private readonly subscriptionService: SubscriptionService,
  ) {}

  assignSubscriptions(attendance: AttendanceModel, subscriptions: SubscriptionModel[]) {
    for (const visitedStudent of attendance.students) {
      switch (visitedStudent.visitStatus) {
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
        Статус оплаты: ${visitedStudent.paymentStatus}. 
        Абонемент: ${visitedStudent.subscription ?? 'не найден'}`,
      );
    }
  }

  getPaymentStatus(visitStatus: VisitStatus, isPaid: boolean): PaymentStatus {
    switch (visitStatus) {
      case VisitStatus.VISITED:
        return isPaid ? PaymentStatus.PAID : PaymentStatus.UNPAID;
      default:
        return PaymentStatus.UNCHARGED;
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
      switch (visitedStudent.visitStatus) {
        case VisitStatus.VISITED:
          // если посетил занятие или перенёс, то ищем абонемент
          const subscription = subscriptions.find(
            (subscription) => subscription.student._id.toString() === visitedStudent.student,
          );

          visitedStudent.subscription = subscription ?? null;
          break;

        // отметим только что не нужно снимать с абонемента, если visitStatus не походит для списания
        default:
          visitedStudent.subscription = null;
      }
    });
  }

  async addPaymentStatus(visitedStudents: IVisitedStudentDto[], lessonId: string) {
    // в зависимости от найденных абонементов - каждому студенту проставим его биллинг статус
    visitedStudents.forEach((visitedStudent) => {
      // костыль с typeguards
      if (typeof visitedStudent.subscription === 'string') return;

      // отметим только что не нужно снимать с абонемента, если visitStatus не походит для списания
      switch (visitedStudent.visitStatus) {
        case VisitStatus.VISITED:
          // Если есть абонемент с которого списать - отметим что занятие оплачено
          if (visitedStudent.subscription && visitedStudent.subscription.visitsLeft > 0) {
            visitedStudent.paymentStatus = PaymentStatus.PAID;
          } else {
            // Иначе не оплачено
            visitedStudent.paymentStatus = PaymentStatus.UNPAID;
          }
          break;

        default:
          visitedStudent.paymentStatus = PaymentStatus.UNCHARGED;
      }

      logger.debug(
        `Занятие: ${lessonId}. Студент ${visitedStudent.student}. 
        Статус визита: ${visitedStudent.visitStatus}. 
        Статус оплаты: ${visitedStudent.paymentStatus}. 
        Абонемент (осталось занятий): ${visitedStudent.subscription?.visitsLeft ?? 'не найден'}`,
      );
    });
  }

  async chargeSubscriptions(visitedStudents: VisitedStudentDto[], lessonId: string) {
    // спишем по одному занятию из списка оставшихся у тех, у кого статус оплачено
    const subscriptionsIds = visitedStudents
      .filter((visitedStudent) => visitedStudent.paymentStatus === PaymentStatus.PAID)
      .map((visitedStudent) => visitedStudent.subscription);

    logger.debug(`
      Занятие ${lessonId}. Списание оплаченных занятий у ${subscriptionsIds.length} студентов.
    `);
    if (!subscriptionsIds.length) return;

    // обновляем абонементы - списываем с каждого по одному занятию
    await this.subscriptionService.updateMany(
      { _id: { $in: subscriptionsIds } },
      { $inc: { visitsLeft: -1 } },
    );
  }

  async changePaymentStatus(
    updatedVisitedStudents: VisitedStudentDto[],
    attendance: AttendanceModel,
  ) {
    logger.debug(
      `Посещённое занятие: ${attendance._id}. Проверяем обновлённый список посетивших студентов: ${updatedVisitedStudents}`,
    );

    // проверим списки студентов и найдём отличающуюся информацию
    const studentsWithChangedStatuses = this.compareVisits(updatedVisitedStudents, attendance);

    if (!studentsWithChangedStatuses.length) {
      logger.debug(
        `Посещенное занятие: ${attendance._id}. Нет студентов с отличающейся информаией`,
      );
      return;
    }

    logger.debug(`
      Посещённое занятие: ${attendance._id}. Изменился статус у ${studentsWithChangedStatuses.length} студентов. 
    `);

    // возвращаем все изменения в абонементах сделанные по прошлому занятию обратно
    await this.chargeBackSubscriptions(studentsWithChangedStatuses);

    const updatedStudents = studentsWithChangedStatuses.map(
      (prevAndNextVisit) => prevAndNextVisit.updatedVisit,
    );
    const lessonId = attendance.lesson._id.toString();

    // найдём абонемент с которого списать
    await this.addSubscription(updatedStudents, lessonId, attendance.date);

    // добавим биллинг статус
    await this.addPaymentStatus(updatedStudents, lessonId);

    // конвертируем объекты с подписками в обычные текстовые строки с id
    this.normalizeSubscriptionIds(updatedStudents);

    // спишем занятие
    await this.chargeSubscriptions(updatedStudents, lessonId);
  }

  // сравним полученный обновленный список студентов с уже отмеченными студентами
  compareVisits(updatedVisitedStudents: VisitedStudentDto[], attendance: AttendanceModel) {
    const studentsWithChangedStatuses: Array<IPrevAndUpdatedVisit> = [];

    updatedVisitedStudents.forEach((updatedVisitedStudent) => {
      // ищем предыдущий визит для этого студента
      const previousVisit = attendance.students.find(
        (visitedStudent) =>
          (visitedStudent.student?._id.toString() || visitedStudent.student) ===
          updatedVisitedStudent.student,
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

    studentsWithChangedStatuses.forEach((prevAndUpdatedVisit) => {
      const { prevVisit } = prevAndUpdatedVisit;

      // если у нас нет абонемента на предыдущее занятие или с него не было списания - то искать разницу не нужно
      if (!prevVisit?.subscription || prevVisit.paymentStatus !== PaymentStatus.PAID) return;

      // смотрим какой был статус и какой новый
      switch (prevVisit.visitStatus) {
        // если старый статус ПОСЕТИЛ вернём ему списанное занятие
        case VisitStatus.VISITED:
          increaseVisitsLeft.ids.push(prevVisit.subscription);
          break;

        // если старый статус не подразуемвал списания - то ничего не делаем
        default:
      }
    });

    // по полученным спискам ID абонементов где есть отличия пройдём по всем и внесём изменения в абонементы
    await (async (change: IChargeBackSubscription) => {
      if (!change.ids.length) return;

      const updatedResult = await this.subscriptionService.updateMany(
        { _id: { $in: change.ids } },
        { $inc: change.action },
      );

      logger.debug(
        `У ${change.ids.length} студентов выполнено действие ${change.action}. Обновлено ${updatedResult.modifiedCount} документов`,
      );
    })(increaseVisitsLeft);
  }
}
