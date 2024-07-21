import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model, QueryOptions, mongo } from 'mongoose';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { SubscriptionModel, SubscriptionDocument } from '../schemas';
import { IFilterQuery } from '../shared/IFilterQuery';
import { AttendanceService } from '../attendance/attendance.service';
import { logger } from '../shared/logger.middleware';
import { withTransaction } from '../shared/withTransaction';

@Injectable()
export class SubscriptionService {
  private readonly populateQuery: Array<string>;

  constructor(
    @Inject(forwardRef(() => AttendanceService))
    private readonly attendanceService: AttendanceService,
    @InjectModel(SubscriptionModel.name)
    private readonly subscriptionModel: Model<SubscriptionDocument>,
  ) {
    this.populateQuery = ['student', 'lessons'];
  }

  async createAndChargeUnpaid(
    createSubscriptionDto: CreateSubscriptionDto,
  ): Promise<SubscriptionModel> {
    logger.info(`
      Создание абонемента для студента ${createSubscriptionDto.student} \
      по занятиям ${createSubscriptionDto.lessons}. \
      Детали ${JSON.stringify(createSubscriptionDto)}
    `);

    // сначала создадим абонемент
    const createdSubscription = await this.create(createSubscriptionDto);

    // ищем все неоплаченные занятия по этому студенту
    const unpaidAttendances =
      await this.attendanceService.findUnpiadAttendances(
        createSubscriptionDto.dateFrom,
        createSubscriptionDto.dateTo,
        createSubscriptionDto.student,
      );

    // если таких нет - вернём сразу созданный абонемент
    if (!unpaidAttendances.length) {
      logger.debug(`
        Студент ${createSubscriptionDto.student}. Нет неоплаченных занятий в целом. \
        Возвращаем абонемент ${createdSubscription._id}
      `);
      return createdSubscription;
    }

    // есть ли среди неоплаченных занятий занятие, на которое сейчас оформляется абонемент
    const unpaidLessons = unpaidAttendances.filter((attendance) =>
      createSubscriptionDto.lessons.includes(attendance.lesson._id.toString()),
    );

    // если таких нет - вернём сразу созданный абонемент
    if (!unpaidLessons.length) {
      logger.debug(`
        Студент ${createSubscriptionDto.student}. Нет неоплаченных занятий. \
        Возвращаем абонемент ${createdSubscription._id}
      `);
      return createdSubscription;
    }

    // сортируем по дате чтобы сначала были оплачены более ранние занятия
    unpaidLessons.sort((a, b) => a.date - b.date);

    logger.debug(`
      Студент ${createSubscriptionDto.student}. Есть неоплаченные занятия. \
      Всего ${unpaidLessons.length}. Детали ${JSON.stringify(unpaidLessons)}
    `);

    /* 
      ! Логика обработки создания абонемента при наличии задолженности
      1. берём первые неолаченные занятия, но не более количества в абонементе 
      2. списываем найденныеы неоплаченные занятия
      3. помечает занятия как оплаченные
      4. обновляет количество занятий в только что созданном абонементе
    */

    const transaction = async (session: ClientSession) => {
      const lessonsToChange = unpaidLessons.slice(
        0,
        createdSubscription.visitsTotal,
      );

      logger.debug(`
        Студент ${createSubscriptionDto.student}. Списываем ${lessonsToChange.length} занятий \
        из абонемента ${createdSubscription._id}. Детали ${JSON.stringify(lessonsToChange)}
      `);

      // списываем занятия
      await Promise.all(
        lessonsToChange.map((attendance) =>
          this.attendanceService.updateAttendedStudentPaymentStatusById(
            attendance._id.toString(),
            createSubscriptionDto.student,
            createdSubscription._id.toString(),
          ),
        ),
      );

      logger.debug(`
        Студент ${createSubscriptionDto.student}. Обновили посещённые (неоплаченные) занятия. \
        Меняем созданный абонемент ${createdSubscription._id}. \
        Количество занятий в абонемнте: ${createdSubscription.visitsTotal}. \
        Будет списано: ${lessonsToChange.length}. \
        Останется: ${createdSubscription.visitsTotal - lessonsToChange.length}
      `);

      // обновляем количество занятий в абонементе
      const updated = await this.subscriptionModel.findByIdAndUpdate(
        createdSubscription._id,
        {
          $set: {
            visitsLeft:
              createdSubscription.visitsTotal - lessonsToChange.length,
          },
        },
        { new: true },
      );

      logger.debug(`
        Студент ${createSubscriptionDto.student}. \
        Обновили количество занятий в абонементе ${createdSubscription._id}. \
        Обнолённый абонемент ${JSON.stringify(updated)}
      `);

      return updated;
    };

    const transactionResult = await withTransaction(
      this.subscriptionModel,
      transaction,
    );

    if (!transactionResult) {
      logger.debug(`
        Студент ${createSubscriptionDto.student}. \
        Не выполнить транзакцию при списании неоплаченных занятий \
        с абонемента ${createdSubscription._id}.
      `);
    }

    return transactionResult ?? createdSubscription;
  }

  async create(
    createSubscriptionDto: CreateSubscriptionDto,
  ): Promise<SubscriptionModel> {
    // ! можно ли как-то проверить на повтор? Как? Имя & дата начала & ID занятие && кол-во
    const created = await this.subscriptionModel.create(createSubscriptionDto);

    return created;
  }

  async findAll(
    query?: IFilterQuery<SubscriptionModel>,
    options?: QueryOptions,
  ): Promise<Array<SubscriptionModel>> {
    return await this.subscriptionModel
      .find(query ?? {}, null, options)
      .populate(this.populateQuery);
  }

  async findOne(
    query: IFilterQuery<SubscriptionModel>,
  ): Promise<SubscriptionModel | null> {
    return await this.subscriptionModel
      .findOne(query)
      .populate(this.populateQuery);
  }

  async findOneById(id: string): Promise<SubscriptionModel | null> {
    return await this.subscriptionModel
      .findById(id)
      .populate(this.populateQuery);
  }

  async update(
    id: string,
    updateSubscriptionDto: UpdateSubscriptionDto,
  ): Promise<SubscriptionModel | null> {
    const updated = await this.subscriptionModel.findByIdAndUpdate(
      id,
      updateSubscriptionDto,
      {
        new: true,
      },
    );

    return updated;
  }

  async updateMany(
    ids: IFilterQuery<SubscriptionModel>,
    update: IFilterQuery<SubscriptionModel>,
  ): Promise<mongo.UpdateResult> {
    const updated = await this.subscriptionModel.updateMany(ids, update);
    return updated;
  }

  async remove(id: string) {
    await this.subscriptionModel.findByIdAndRemove(id);
    return;
  }
}
