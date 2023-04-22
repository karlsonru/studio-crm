import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model, PopulateOptions } from 'mongoose';
import { VisitedLessonEntity } from './entities/visited-lesson.entity';
import { CreateVisitedLessonDto } from './dto/create-visited-lesson.dto';
import { UpdateVisitedLessonDto } from './dto/update-visited-lesson.dto';
import { VisitedLessonModel, VisitedLessonDocument } from '../schemas';
import { BillingService } from '../billing/billing.service';
import { IFilterQuery } from '../shared/IFilterQuery';
import { withTransaction } from '../shared/withTransaction';
import { logger } from '../shared/logger.middleware';

@Injectable()
export class VisitedLessonService {
  private readonly populateQueryVisitedLesson: Array<string | PopulateOptions>;

  constructor(
    @InjectModel(VisitedLessonModel.name)
    private readonly visitedLessonModel: Model<VisitedLessonDocument>,
    private readonly billingService: BillingService,
  ) {
    this.populateQueryVisitedLesson = [
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

  async create(
    createVisitedLessonDto: CreateVisitedLessonDto,
  ): Promise<VisitedLessonEntity | null> {
    logger.debug(`
      Обрабатываем запрос на создание нового посещённого занятия по уроку с ID:
      ${createVisitedLessonDto.lesson} за дату 
      ${new Date(createVisitedLessonDto.date).toDateString()}
    `);

    const candidate = await this.visitedLessonModel.findOne({
      $and: [{ date: createVisitedLessonDto.date }, { lesson: createVisitedLessonDto.lesson }],
    });

    if (candidate) {
      logger.debug(`Занятие уже существует`);
      return null;
    }

    const transaction = async (session: ClientSession) => {
      // для каждого студента добавим абонемент с которго нужно списать
      await this.billingService.addSubscription(
        createVisitedLessonDto.students,
        createVisitedLessonDto.lesson,
        createVisitedLessonDto.date,
      );

      // для каждого студента добавим биллинг статус
      await this.billingService.addBillingStatus(
        createVisitedLessonDto.students,
        createVisitedLessonDto.lesson,
      );

      // после проставления статусов спишем занятия с найденных абонементов
      await this.billingService.chargeSubscriptions(
        createVisitedLessonDto.students,
        createVisitedLessonDto.lesson,
      );

      // сохраним само занятие и вернём его
      return await this.visitedLessonModel.create(createVisitedLessonDto);
    };

    const created = await withTransaction<VisitedLessonDocument>(
      this.visitedLessonModel,
      transaction,
    );

    return created;
  }

  async findAll(query?: IFilterQuery<VisitedLessonEntity>): Promise<Array<VisitedLessonEntity>> {
    return await this.visitedLessonModel
      .find(query ?? {})
      .populate(this.populateQueryVisitedLesson);
  }

  async findOne(id: string): Promise<VisitedLessonEntity | null> {
    return await this.visitedLessonModel.findById(id).populate(this.populateQueryVisitedLesson);
  }

  async update(
    id: string,
    updateVisitedLessonDto: UpdateVisitedLessonDto,
  ): Promise<VisitedLessonEntity | null> {
    logger.debug(`Посещённое занятие: ${id}}. Получен запрос на обновление. Ищем занятие`);

    // найдём занятие, которое нужно обновить
    const visitedLesson = await this.findOne(id);

    if (visitedLesson === null) {
      logger.debug(`Посещённое занятие ${id} не найдено`);
      return null;
    }

    // добавлям транзакцию для обновления различных статусов абонементов
    const transaction = async (session: ClientSession) => {
      if (updateVisitedLessonDto.students) {
        await this.billingService.changeBillingStatus(
          updateVisitedLessonDto.students,
          visitedLesson,
        );
      }

      // обновим занятие и вернём результат
      return await this.visitedLessonModel.findByIdAndUpdate(id, updateVisitedLessonDto, {
        new: true,
      });
    };

    const updated = await withTransaction<VisitedLessonDocument>(
      this.visitedLessonModel,
      transaction,
    );

    return updated;
  }

  async remove(id: string) {
    await this.visitedLessonModel.findByIdAndRemove(id);
    return;
  }
}
