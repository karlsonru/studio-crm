import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model, PopulateOptions } from 'mongoose';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { AttendanceModel, AttendanceDocument } from '../schemas';
import { SubscriptionChargeService } from '../subscription-charge/subscriptionCharge.service';
import { IFilterQuery } from '../shared/IFilterQuery';
import { withTransaction } from '../shared/withTransaction';
import { logger } from '../shared/logger.middleware';

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
    private readonly subscriptionChargeService: SubscriptionChargeService,
  ) {
    this.populateQueryAttendance = [
      'lesson',
      'teacher',
      {
        path: 'students',
        populate: {
          path: 'student',
        },
      },
    ];
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

    if (candidate) {
      logger.debug(`Занятие уже существует`);
      return null;
    }

    const transaction = async (session: ClientSession) => {
      // для каждого студента добавим абонемент с которго нужно списать
      await this.subscriptionChargeService.addSubscription(
        createAttendanceDto.students,
        createAttendanceDto.lesson,
        createAttendanceDto.date,
      );

      // для каждого студента добавим биллинг статус
      await this.subscriptionChargeService.addBillingStatus(
        createAttendanceDto.students,
        createAttendanceDto.lesson,
      );

      // конвертируем объекты с подписками в обычные текстовые строки с id
      this.subscriptionChargeService.normalizeSubscriptionIds(createAttendanceDto.students);

      // после проставления статусов спишем занятия с найденных абонементов
      await this.subscriptionChargeService.chargeSubscriptions(
        createAttendanceDto.students,
        createAttendanceDto.lesson,
      );

      // сохраним само занятие и вернём его
      return await this.attendanceModel.create(createAttendanceDto);
    };

    const created = await withTransaction<AttendanceDocument>(this.attendanceModel, transaction);

    return created;
  }

  async findAll(query: IFilterQuery<AttendanceModel>): Promise<Array<AttendanceModel>> {
    return await this.attendanceModel.find(query).populate(this.populateQueryAttendance);
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
      if (updateAttendanceDto.students) {
        await this.subscriptionChargeService.changeBillingStatus(
          updateAttendanceDto.students,
          visitedLesson,
        );
      }

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
