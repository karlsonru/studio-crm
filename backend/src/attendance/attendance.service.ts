import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model, PopulateOptions } from 'mongoose';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { AttendanceModel, AttendanceDocument } from '../schemas';
import { AttendancePaymentService } from './attendancePayment.service';
// import { SubscriptionChargeService } from '../subscription-charge/subscriptionCharge.service';
import { IFilterQuery } from '../shared/IFilterQuery';
import { withTransaction } from '../shared/withTransaction';
import { logger } from '../shared/logger.middleware';
import { LessonService } from '../lesson/lesson.service';
import { AttendanceType, PaymentStatus, VisitType } from '../schemas/attendance.schema';

interface ICreateAttendance extends Pick<CreateAttendanceDto, 'lesson' | 'teacher' | 'students'> {
  date: number;
  day: number;
}

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
    // если передаеём ID конкретного студента - ищем по нему, если нет - ищем все за период
    const studentsQuery = {
      students: {
        $elemMatch: studentId
          ? { student: studentId, paymentStatus: PaymentStatus.UNPAID }
          : { paymentStatus: PaymentStatus.UNPAID },
      },
    };

    const unpaidAttendances = await this.attendanceModel.find({
      $and: [{ date: { $gte: dateFrom, $lte: dateTo } }, studentsQuery],
    });

    return unpaidAttendances;
  }

  async create(createAttendanceDto: ICreateAttendance): Promise<AttendanceModel | null> {
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
      logger.debug(`Занятие уже существует`);
      return null;
    }

    const transaction = async (session: ClientSession) => {
      // для каждого студента добавим абонемент с которго нужно списать
      await this.attendancePaymentService.addSubscription(
        createAttendanceDto.students,
        createAttendanceDto.lesson,
        createAttendanceDto.date,
      );

      // для каждого студента добавим биллинг статус
      await this.attendancePaymentService.addPaymentStatus(
        createAttendanceDto.students,
        createAttendanceDto.lesson,
      );

      // конвертируем объекты с подписками в обычные текстовые строки с id
      this.attendancePaymentService.normalizeSubscriptionIds(createAttendanceDto.students);

      // после проставления статусов спишем занятия с найденных абонементов
      await this.attendancePaymentService.chargeSubscriptions(
        createAttendanceDto.students,
        createAttendanceDto.lesson,
      );

      // удалим студентов с однократным посещением из основного занятия
      await this.lessonService.updateStudents(
        createAttendanceDto.lesson,
        {
          students: createAttendanceDto.students.map((visited) =>
            visited.visitType !== VisitType.REGULAR ? visited.student : null,
          ),
        },
        'remove',
      );

      // если уже было занятие из будущего - удалим его сейчас
      if (candidate && candidate.type === AttendanceType.FUTURE) {
        logger.debug(`Удалим существующее занятие из будущего`);
        this.remove(candidate._id.toString());
      }

      // Это занятие из будущего ?
      const isFuture = createAttendanceDto.date > Date.now();

      // сохраним само занятие и вернём его
      return await this.attendanceModel.create({
        ...createAttendanceDto,
        type: isFuture ? AttendanceType.FUTURE : AttendanceType.DONE,
      });
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

    // добавлям транзакцию для обновления различных статусов абонементов
    const transaction = async (session: ClientSession) => {
      if (!updateAttendanceDto.students) {
        const updated = await this.attendanceModel.findByIdAndUpdate(id, updateAttendanceDto, {
          new: true,
        });
        return updated;
      }

      await this.attendancePaymentService.changePaymentStatus(
        updateAttendanceDto.students,
        visitedLesson,
      );

      // удалим студентов с однократным посещением из основного занятия
      await this.lessonService.updateStudents(
        visitedLesson.lesson._id.toString(),
        {
          students: updateAttendanceDto.students?.map((visited) =>
            visited.visitType !== VisitType.REGULAR ? visited.student : null,
          ),
        },
        'remove',
      );

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
