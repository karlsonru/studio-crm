import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model, PopulateOptions } from 'mongoose';
import { UpdateAttendanceDto, UpdatedVisitedStudent } from './dto/update-attendance.dto';
import { CreateAttendanceDtoSchemaAdapter } from './createAttendanceDtoSchemaAdapter';
import { AttendanceModel, AttendanceDocument } from '../schemas';
import { AttendancePaymentService } from './attendancePayment.service';
import { IFilterQuery } from '../shared/IFilterQuery';
import { withTransaction } from '../shared/withTransaction';
import { logger } from '../shared/logger.middleware';
import { LessonService } from '../lesson/lesson.service';
import { AttendanceType, PaymentStatus, VisitType } from '../schemas/attendance.schema';

@Injectable()
export class AttendanceService {
  private readonly populateQueryAttendance: Array<string | PopulateOptions>;

  constructor(
    @InjectModel(AttendanceModel.name)
    private readonly attendanceModel: Model<AttendanceDocument>,
    private readonly attendancePaymentService: AttendancePaymentService,
    private readonly lessonService: LessonService,
  ) {
    this.populateQueryAttendance = [
      { path: 'lesson', select: ['_id', 'title'] },
      { path: 'teacher', select: ['_id', 'fullname'] },
      {
        path: 'students',
        populate: { path: 'student', select: ['_id', 'fullname'] },
      },
    ];
  }

  async findUnpiadAttendances(dateFrom: number, dateTo: number, studentId?: string) {
    const queryTemplates = {
      withStudentId: { student: studentId, paymentStatus: PaymentStatus.UNPAID },
      withoutStudentId: { paymentStatus: PaymentStatus.UNPAID },
    };

    const studentsQuery = studentId
      ? queryTemplates.withStudentId
      : queryTemplates.withoutStudentId;

    // если передаеём ID конкретного студента - ищем по нему, если нет - ищем все за период
    const unpaidAttendances = await this.attendanceModel.find({
      $and: [
        { date: { $gte: dateFrom, $lte: dateTo } },
        { students: { $elemMatch: studentsQuery } },
      ],
    });

    return unpaidAttendances;
  }

  async create(
    createAttendanceDto: CreateAttendanceDtoSchemaAdapter,
  ): Promise<AttendanceModel | null> {
    logger.debug(`
      Обрабатываем запрос на создание нового посещённого занятия по уроку с ID:
      ${createAttendanceDto.lesson} за дату 
      ${new Date(createAttendanceDto.date).toDateString()}
    `);

    const candidate = await this.attendanceModel.findOne({
      date: createAttendanceDto.date,
      lesson: createAttendanceDto.lesson,
    });

    if (candidate && candidate.type === AttendanceType.DONE) {
      logger.debug(`Занятие ${createAttendanceDto.lesson}. Занятие уже существует`);
      return null;
    }

    const transaction = async (session: ClientSession) => {
      // Найдем абонементы для студентов, которым нужно списать занятия
      const subscriptions = await this.attendancePaymentService.findSubscriptionsForAttendance(
        createAttendanceDto.lesson,
        createAttendanceDto.students.map((student) => student.student),
        createAttendanceDto.date,
      );

      // Добавим абонемент для студентов
      this.attendancePaymentService.setSubscriptionsForStudents(
        createAttendanceDto.lesson,
        createAttendanceDto.students,
        subscriptions,
      );

      // Спишем абонементы от студентов
      await this.attendancePaymentService.chargeSubscriptions(
        createAttendanceDto.lesson,
        createAttendanceDto.students
          .filter((student) => student.subscription)
          .map((student) => student.subscription) as string[],
      );

      // установим статус оплат после выполнения списаний
      createAttendanceDto.students.forEach((student) => {
        student.setPaymentStatus();
      });

      // ищем есть ли здесь студенты добавленные на одно занятие
      const oneTimeStudents = createAttendanceDto.students.filter((student) =>
        student.isOneTimeVisit(),
      );

      logger.debug(`
        Занятие ${createAttendanceDto.lesson}. 
        Найдено ${oneTimeStudents.length} однократных посещений.
      `);

      if (oneTimeStudents.length) {
        const oneTimeStudentsIds = oneTimeStudents.map((student) => student.student);

        logger.debug(
          `Студенты с однократным посещением: ${oneTimeStudentsIds}. Удаляем из основного занятия.`,
        );

        // Удалим студентов с однократным посещением из основного занятия
        await this.lessonService.updateStudents(
          createAttendanceDto.lesson,
          { students: oneTimeStudentsIds },
          'remove',
        );
      }

      // ! Если у нас была добавлена отработка у одного из студдентов - она удалится. Возможно нужно делать update в этих случаях, а не удалять

      // если уже было занятие из будущего - удалим его сейчас
      if (candidate && candidate.type === AttendanceType.FUTURE) {
        logger.debug(
          `занятие: ${createAttendanceDto.lesson}. Удалим существующее занятие из будущего`,
        );
        await this.remove(candidate._id.toString());
      }

      // сохраним само занятие и вернём его
      const created = await this.attendanceModel.create(createAttendanceDto);

      return created;
    };

    const created = await withTransaction<AttendanceDocument>(this.attendanceModel, transaction);

    return created;
  }

  async findAll(query: IFilterQuery<AttendanceModel>): Promise<Array<AttendanceModel>> {
    return await this.attendanceModel
      .find(query)
      .populate(this.populateQueryAttendance)
      .sort({ date: -1 });
  }

  async findOne(id: string): Promise<AttendanceModel | null> {
    return await this.attendanceModel.findById(id).populate(this.populateQueryAttendance);
  }

  async updateAttendnedStudentById(
    attendanceId: string,
    studentId: string,
    updateAttendanceDto: UpdatedVisitedStudent,
    action: 'add' | 'remove',
  ) {
    logger.debug(`
      Посещённое занятие: ${attendanceId}. Действие: ${action}. Обновляем студента ${studentId}.
    `);

    const visitedLesson = await this.findOne(attendanceId);

    if (visitedLesson === null) {
      logger.debug(`Посещённое занятие ${attendanceId} не найдено`);
      return null;
    }

    const candidate = visitedLesson.students.find(
      (student) => student.student._id.toString() === studentId,
    );

    if (!candidate) {
      logger.debug(`Посещённое занятие ${attendanceId} не содержит студента ${studentId}`);
      return null;
    }

    // * Кейс - добавляем отработку студенту, раньше отработки не было

    // если у нас передан lessonId, вместо которого нужно сделать занятие
    if (
      action === 'add' &&
      updateAttendanceDto.visitInstead &&
      updateAttendanceDto.visitInsteadDate
    ) {
      const transaction = async (session: ClientSession) => {
        logger.debug(
          `Посещённое занятие ${attendanceId}. Обновляем студента ${studentId}. Начинаем выполнять транзакцию.`,
        );
        // обновим visitInstead (отработка) у студента в этом attendance
        const updated = await this.attendanceModel.findOneAndUpdate(
          { _id: attendanceId, 'students.student': studentId },
          {
            $set: {
              'students.$.visitInstead': updateAttendanceDto.visitInstead,
              'students.$.visitInsteadDate': updateAttendanceDto.visitInsteadDate,
            },
          },
          { new: true },
        );

        logger.debug(`
          Посещённое занятие ${attendanceId}. 
          Добавляем студента ${studentId} в lesson ${updateAttendanceDto.visitInstead}. 
          Статус ${VisitType.POSTPONED}, 
          дата ${new Date(updateAttendanceDto.visitInsteadDate ?? Date.now()).toISOString()}.
        `);

        // добавим к lesson студента и дату отработки
        await this.lessonService.updateStudents(
          updateAttendanceDto.visitInstead as string,
          {
            students: [
              {
                student: studentId,
                visitType: VisitType.POSTPONED,
                visitInstead: attendanceId,
                date: updateAttendanceDto.visitInsteadDate ?? null,
              },
            ],
          },
          action,
        );

        return updated;
      };

      return await withTransaction<AttendanceDocument>(this.attendanceModel, transaction);
    }

    if (action === 'remove') {
      const transaction = async (session: ClientSession) => {
        logger.debug(
          `Посещённое занятие ${attendanceId}. Обновляем студента ${studentId}. Начинаем выполнять транзакцию.`,
        );
        // обновим visitInstead (отработка) у студента в этом attendance
        const updated = await this.attendanceModel.findOneAndUpdate(
          { _id: attendanceId, 'students.student': studentId },
          {
            $set: {
              'students.$.visitInstead': null,
              'students.$.visitInsteadDate': null,
            },
          },
          { new: true },
        );

        logger.debug(`
          Посещённое занятие ${attendanceId}. 
          Удаляем студента ${studentId} из lesson ${updateAttendanceDto.visitInstead}. 
        `);

        await this.lessonService.updateStudents(
          updateAttendanceDto.visitInstead as string,
          { students: [studentId] },
          action,
        );

        return updated;
      };

      return await withTransaction<AttendanceDocument>(this.attendanceModel, transaction);
    }
  }

  async update(
    id: string,
    updateAttendanceDto: UpdateAttendanceDto,
  ): Promise<AttendanceModel | null> {
    logger.debug(`Посещённое занятие: ${id}}. Получен запрос на обновление. Ищем занятие`);

    // найдём занятие, которое нужно обновить
    const visitedLesson = await this.findOne(id);

    if (visitedLesson === null) {
      logger.debug(`Посещённое занятие ${id} не найдено`);
      return null;
    }

    // если массив со студентами не передан - обновим только то что прислали
    if (!updateAttendanceDto.students) {
      return await this.attendanceModel.findByIdAndUpdate(
        id,
        { ...visitedLesson, ...updateAttendanceDto },
        { new: true },
      );
    }

    // добавлям транзакцию для сравнения и обновления различных статусов посещения студентов
    const transaction = async (session: ClientSession) => {
      await this.attendancePaymentService.changePaymentStatus(visitedLesson, updateAttendanceDto);

      console.log(JSON.stringify(updateAttendanceDto));

      // обновим занятие и вернём результат
      return await this.attendanceModel.findByIdAndUpdate(id, updateAttendanceDto, {
        new: true,
      });
    };

    const updated = await withTransaction<AttendanceDocument>(this.attendanceModel, transaction);

    return updated;
  }

  async remove(id: string) {
    await this.attendanceModel.findByIdAndRemove(id);
    return;
  }
}
