import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { logger } from '../shared/logger.middleware';
import {
  VisitStatus,
  PaymentStatus,
  VisitedStudentWithVisitDetails as VisitedStudentWithVisitDetailsModel,
} from '../schemas/attendance.schema';
import { AttendanceModel, SubscriptionModel } from '../schemas';
import { SubscriptionService } from '../subscription/subscription.service';
import { VisitedStudentWithVisitDetails } from './createAttendanceDtoSchemaAdapter';
import {
  UpdateAttendanceDto,
  UpdatedVisitedStudent,
  UpdatedVisitedStudentDtoAdapter,
} from './dto/update-attendance.dto';

interface IPrevAndUpdatedVisit {
  prevVisit: VisitedStudentWithVisitDetailsModel | undefined;
  updatedVisit: UpdatedVisitedStudentDtoAdapter;
}

interface IChangeSubscriptions {
  ids: Array<string>;
  action: Partial<Record<'visitsTotal' | 'visitsLeft' | 'visitsPostponed', number>>;
}

@Injectable()
export class AttendancePaymentService {
  constructor(
    @Inject(forwardRef(() => SubscriptionService))
    private readonly subscriptionService: SubscriptionService,
  ) {}

  async findSubscriptionsForAttendance(lessonId: string, studentsIds: string[], date: number) {
    logger.info(
      `Занятие ${lessonId}. Ищем абонементы для списания для ${studentsIds.length} студентов.`,
    );

    return await this.subscriptionService.findAll(
      {
        $and: [
          { lesson: lessonId },
          { student: { $in: studentsIds } },
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
  }

  getStudentId(student: VisitedStudentWithVisitDetails | UpdatedVisitedStudent) {
    if (typeof student.student === 'string') return student.student;
    return (student as UpdatedVisitedStudent).student;
  }

  setSubscriptionsForStudents(
    lessonId: string,
    students: VisitedStudentWithVisitDetails[] | UpdatedVisitedStudent[],
    subscriptions: SubscriptionModel[],
  ) {
    logger.debug(`
      Занятие ${lessonId}. Найдено ${subscriptions.length} абонементов'
    `);
    for (const student of students) {
      const studentId = this.getStudentId(student);

      if (student.paymentStatus !== PaymentStatus.PAID || student.subscription) {
        logger.debug(`
          Студент ${studentId}.
          Нет абонемента для добавления. 
          Статус оплаты: ${student.paymentStatus}. 
          Абонемент: ${student.subscription}. 
        `);
        continue;
      }

      const subscription = subscriptions.find(
        (subscription) => subscription.student._id.toString() === studentId,
      );

      student.subscription = subscription?._id.toString() || null;

      logger.debug(`
        Студент ${student.student}. 
        Добавляем абонемент.
        Предварительный статус: ${student.paymentStatus}. 
        Абонемент: ${subscription}. 
        Осталось занятий: ${subscription?.visitsLeft}.
      `);
    }
  }

  async chargeSubscriptions(lessonId: string, subscriptionIds: string[]) {
    logger.debug(`
      Занятие ${lessonId}. Списание оплаченных занятий c ${subscriptionIds.length} абонементов.
    `);

    if (!subscriptionIds.length) return;

    // обновляем абонементы - списываем с каждого по одному занятию
    await this.changeSubscriptions({
      ids: subscriptionIds,
      action: { visitsLeft: -1 },
    });
  }

  async changePaymentStatus(attendance: AttendanceModel, updateAttendanceDto: UpdateAttendanceDto) {
    logger.debug(
      `Посещённое занятие: ${attendance._id}. 
      Проверяем обновлённый список посетивших студентов: ${updateAttendanceDto.students?.length}`,
    );

    if (!updateAttendanceDto.students) {
      return;
    }

    // проверим списки студентов и найдём отличающуюся информацию
    const studentsWithChangedStatuses = this.compareVisits(
      attendance,
      updateAttendanceDto.students,
    );

    if (!studentsWithChangedStatuses.length) {
      logger.debug(
        `Посещенное занятие: ${attendance._id}. Нет студентов с отличающейся информаией`,
      );
      return;
    }

    logger.debug(`
      Посещённое занятие: ${attendance._id}. 
      Изменился статус у ${studentsWithChangedStatuses.length} студентов. 
      Возвращаем занятия на абонементы. 
    `);

    // возвращаем все изменения в абонементах сделанные по прошлому занятию обратно
    await this.changeBackSubscriptions(studentsWithChangedStatuses);

    const updatedStudents = studentsWithChangedStatuses.map(
      (prevAndNextVisit) => prevAndNextVisit.updatedVisit,
    );
    const lessonId = attendance.lesson._id.toString();

    logger.debug(`Посещённое занятие: ${attendance._id}. Ищем абонементы для списания.`);

    // найдём абонемент с которого списать
    const subscriptions = await this.findSubscriptionsForAttendance(
      attendance.lesson._id.toString(),
      updatedStudents
        .filter((student) => student.isVisitPayable(student.visitStatus))
        .map((student) => student.student),
      attendance.date,
    );

    logger.debug(
      `Посещённое занятие: ${attendance._id}. Устанавливаем найденные абонементы (${subscriptions.length}) студентам.`,
    );

    // установим абонементы пользователям
    this.setSubscriptionsForStudents(lessonId, updatedStudents, subscriptions);

    // спишем с этих абонементов
    const subscriptionIds = updatedStudents
      .filter((student) => student.subscription)
      .map((student) => student.subscription) as string[];

    logger.debug(
      `Посещённое занятие: ${attendance._id}. Списываем занятия из абонементов (${subscriptionIds.length}).`,
    );

    if (subscriptionIds.length) {
      await this.chargeSubscriptions(lessonId, subscriptionIds);
    }

    logger.debug(
      `Посещённое занятие: ${attendance._id}. Обновим статус оплаты для студентов (${updatedStudents.length}).`,
    );

    // установим статус оплаты
    updatedStudents.forEach((student) => {
      student.setPaymentStatus();
    });
  }

  // сравним полученный обновленный список студентов с уже отмеченными студентами
  compareVisits(
    attendance: AttendanceModel,
    updatedVisitedStudents: UpdatedVisitedStudentDtoAdapter[],
  ) {
    const studentsWithChangedStatuses: Array<IPrevAndUpdatedVisit> = [];

    updatedVisitedStudents.forEach((updatedVisitedStudent) => {
      // ищем предыдущий визит для этого студента
      const previousVisit = attendance.students.find(
        (visitedStudent) => visitedStudent.student._id.toString() === updatedVisitedStudent.student,
      );

      // ничего не делаем, если статус визита не измениля
      if (updatedVisitedStudent.visitStatus === previousVisit?.visitStatus) {
        logger.debug(`
          Посещённое занятие: ${attendance._id}. Статус студента ${updatedVisitedStudent.student} не изменился
        `);
        return;
      }

      // если нет предыдущего визита для этого студента - то это новый студент, ранее не отмечался
      if (!previousVisit) {
        logger.debug(
          `Посещённое занятие: ${attendance._id}. Новый студент ${updatedVisitedStudent.student}`,
        );
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

  async changeBackSubscriptions(studentsWithChangedStatuses: Array<IPrevAndUpdatedVisit>) {
    const increaseVisitsLeft: IChangeSubscriptions = {
      ids: [],
      action: { visitsLeft: 1 },
    };

    studentsWithChangedStatuses.forEach((prevAndUpdatedVisit) => {
      const { prevVisit } = prevAndUpdatedVisit;

      logger.debug(`
        Студент ${prevVisit?.student._id} (${prevVisit?.student.fullname})
        Предыдущий статус посещения: ${prevVisit?.visitStatus}
        Предыдущий статус оплаты: ${prevVisit?.paymentStatus}
        Предыдущий абонемент: ${prevVisit?.subscription}
        Новый статус посещения: ${prevAndUpdatedVisit.updatedVisit.visitStatus}
        Новый статус оплаты: ${prevAndUpdatedVisit.updatedVisit.paymentStatus}
      `);

      // если у нас нет абонемента на предыдущее занятие (не было списания) - то искать разницу не нужно
      if (!prevVisit?.subscription || prevVisit.paymentStatus !== PaymentStatus.PAID) return;

      // смотрим какой был статус и какой новый
      switch (prevVisit.visitStatus) {
        // если старый статус ПОСЕТИЛ или ОТРАБОТКА вернём ему списанное занятие
        case VisitStatus.POSTPONED_FUTURE:
        case VisitStatus.VISITED:
          logger.debug(
            `Студент ${prevVisit.student._id} вернёл списанное занятие на абонемент ${prevVisit.subscription}`,
          );
          increaseVisitsLeft.ids.push(prevVisit.subscription);
          break;

        // если старый статус не подразуемвал списания - то ничего не делаем
        default:
      }
    });

    logger.debug(`К обновлению ${increaseVisitsLeft.ids.length} абонементов`);

    // по полученным спискам ID абонементов где есть вернём списанные занятия
    if (increaseVisitsLeft.ids.length) {
      await this.changeSubscriptions(increaseVisitsLeft);
    }
  }

  async changeSubscriptions(change: IChangeSubscriptions) {
    const updatedResult = await this.subscriptionService.updateMany(
      { _id: { $in: change.ids } },
      { $inc: change.action },
    );

    logger.debug(`
      У ${change.ids.length} студентов выполнено действие ${change.action}. 
      Обновлено ${updatedResult.modifiedCount} документов. 
      ID обновленных абонементов: ${change.ids.join(', ')}
    `);
  }
}
