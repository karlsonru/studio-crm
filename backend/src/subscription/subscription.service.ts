import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryOptions, mongo } from 'mongoose';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { SubscriptionModel, SubscriptionDocument } from '../schemas';
import { IFilterQuery } from '../shared/IFilterQuery';
import { AttendanceService } from '../attendance/attendance.service';

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
    // сначала создадим абонемент
    const created = await this.create(createSubscriptionDto);

    // ищем неоплаченные занятия по этому студенту
    const unpaidAttendances = await this.attendanceService.findUnpiadAttendances(
      createSubscriptionDto.dateFrom,
      createSubscriptionDto.dateTo,
      createSubscriptionDto.student,
    );

    // если таких нет - вернём сразу созданный абонемент
    if (!unpaidAttendances.length) return created;

    // есть ли среди неоплаченных занятий занятие, на которое сейчас оформляется абонемент
    const unpaidLessons = unpaidAttendances.filter((attendance) =>
      createSubscriptionDto.lessons.includes(attendance.lesson._id.toString()),
    );

    // TODO транзакция которая:
    // 1. списывает занятия
    // 2. находит неоплаченные занятия
    // 3. помечает занятия как оплаченные
    // 4. обновляет количество занятий в абоенементе

    /*
    const transaction = async (session: ClientSession) => {
      // списываем занятия
      await Promise.all(
        unpaidLessons.map((attendance) =>
          this.attendanceService.updateAttendnedStudentById(
            attendance._id.toString(),
            createSubscriptionDto.student,
            {
              student: createSubscriptionDto.student,
              visitStatus: VisitStatus.VISITED,
              paymentStatus: PaymentStatus.PAID,
              subscription: created._id.toString(),
            },
            'add',
          ),
        ),
      );
    };
    */

    /*
     далее в каждом из unpaid lessons / attendances нужно
     1. списать занятие
     2. поменять статус на оплачено
     3. добавить ссылку на абонемент, с которого списали
    */
    return created;
  }

  async create(createSubscriptionDto: CreateSubscriptionDto): Promise<SubscriptionModel> {
    // можно ли как-то проверить на повтор? Как? Имя & дата начала & ID занятие && кол-во
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

  async findOne(query: IFilterQuery<SubscriptionModel>): Promise<SubscriptionModel | null> {
    return await this.subscriptionModel.findOne(query).populate(this.populateQuery);
  }

  async findOneById(id: string): Promise<SubscriptionModel | null> {
    return await this.subscriptionModel.findById(id).populate(this.populateQuery);
  }

  async update(
    id: string,
    updateSubscriptionDto: UpdateSubscriptionDto,
  ): Promise<SubscriptionModel | null> {
    const updated = await this.subscriptionModel.findByIdAndUpdate(id, updateSubscriptionDto, {
      new: true,
    });

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
