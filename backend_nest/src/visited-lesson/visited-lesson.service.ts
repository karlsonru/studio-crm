import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model, PopulateOptions } from 'mongoose';
import { VisitedLessonEntity } from './entities/visited-lesson.entity';
import { CreateVisitedLessonDto } from './dto/create-visited-lesson.dto';
import { UpdateVisitedLessonDto } from './dto/update-visited-lesson.dto';
import { IFilterQuery } from '../shared/IFilterQuery';
import { VisitedLessonModel, VisitedLessonDocument } from '../schemas';
import { Visit, VisitStatus } from '../schemas/visitedLesson.schema';
import { withTransaction } from '../shared/withTransaction';
import { SubscriptionService } from '../subscription/subscription.service';
import { logger } from '../shared/logger.middleware';

interface INewVisit extends Omit<Visit, 'student'> {
  student: string;
}

interface IPrevAndNextVisits {
  prevVisit?: Visit;
  newVisit: INewVisit;
}

@Injectable()
export class VisitedLessonService {
  private readonly populateQueryVisitedLesson: Array<string | PopulateOptions>;

  constructor(
    @InjectModel(VisitedLessonModel.name)
    private readonly visitedLessonModel: Model<VisitedLessonDocument>,
    private readonly subscriptionService: SubscriptionService,
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
    logger.debug(
      `Обрабатываем запрос на создание нового посещённого занятия по уроку с ID: ${
        createVisitedLessonDto.lesson
      } за дату ${new Date(createVisitedLessonDto.date).toDateString()}`,
    );

    const candidate = await this.visitedLessonModel.findOne({
      $and: [{ date: createVisitedLessonDto.date }, { lesson: createVisitedLessonDto.lesson }],
    });

    if (candidate) {
      return null;
    }

    const transaction = async (session: ClientSession) => {
      // найдём всех студентов, про которых сказано что посетили сегодняшнее занятие или занятие перенесено (к отработке)
      const visitedStudents = createVisitedLessonDto.students.filter(
        (visit) =>
          visit.visitStatus === VisitStatus.VISITED || visit.visitStatus === VisitStatus.POSTPONED,
      );

      // найдём все абонементы студентов, посетивших занятие или у кого занятие перенесено (к отработке)
      const subscriptions = await this.subscriptionService.findAll(
        {
          $and: [
            { lesson: createVisitedLessonDto.lesson },
            { student: { $in: visitedStudents.map((visit) => visit.student) } },
            { visitsLeft: { $gte: 1 } },
            { dateTo: { $gte: createVisitedLessonDto.date } },
          ],
        },
        {
          sort: {
            visitsLeft: 1,
          },
        },
      );

      // у всех студентов, которые посетили занятие - добавим _id абонемента с которого будет списание в визит
      const updateSubscriptions: {
        [key in Extract<VisitStatus, 'visited' | 'postponed'>]: string[];
      } = {
        [VisitStatus.VISITED]: [],
        [VisitStatus.POSTPONED]: [],
      };

      visitedStudents.forEach((visit) => {
        Object.defineProperty(visit, 'subscription', {
          enumerable: true,
          value: subscriptions.find(
            (subscription) => subscription.student._id.toString() === visit.student,
          )?._id,
        });

        // @ts-ignore
        updateSubscriptions[visit.visitStatus].push(visit.subscription);
      });

      // обновим сразу все отобранные абонементы - те что посетили уменьшим на 1
      await this.subscriptionService.updateMany(
        { _id: { $in: updateSubscriptions[VisitStatus.VISITED] } },
        { $inc: { visitsLeft: -1 } },
      );

      // те что посетили отложили - перенесём визит из оставшихся в отложенные
      await this.subscriptionService.updateMany(
        { _id: { $in: updateSubscriptions[VisitStatus.POSTPONED] } },
        {
          $inc: {
            visitsLeft: -1,
            visitsPostponed: 1,
          },
        },
      );

      // сохраним] само занятие и вернём его
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
    // найдём занятие, которое нужно обновить
    const lesson = await this.findOne(id);

    if (lesson === null) return null;

    const studentsWithChangedStatuses: Array<IPrevAndNextVisits> = [];

    // ищем студентов у которых статус отличается от сохранённого в БД или которых нет в БД
    updateVisitedLessonDto.students?.forEach((newVisit) => {
      // ищем предыдущий визит этого студента
      const prevVisit = lesson.students.find(
        (visit) => visit.student._id.toString() === newVisit.student,
      );

      // если предыдущий визит не undefined и статус совпадает - ничего не делаем
      if (newVisit.visitStatus === prevVisit?.visitStatus) return;

      // если предыдущего визита не было или статус отличается - значит нужно будет обновить информацию
      studentsWithChangedStatuses.push({
        prevVisit,
        newVisit,
      });
    });

    // отфильтруем студентов у которых не искали абонемент для списывания в prevVisit
    const studentsWithoutSubscriptions = studentsWithChangedStatuses.filter(
      (visits) => !visits.prevVisit?.subscription,
    );

    // найдём все абонементы студентов, у которых нет prevVisit / нет найденного абонемента с которого списать
    const subscriptions = await this.subscriptionService.findAll(
      {
        $and: [
          { lesson: id },
          {
            student: {
              $in: studentsWithoutSubscriptions.map((visits) => visits.newVisit.student),
            },
          },
          { visitsLeft: { $gte: 1 } },
          { dateTo: { $gte: lesson.date } },
        ],
      },
      {
        sort: {
          visitsLeft: 1,
        },
      },
    );

    // обновим у таких студентов subscription в prevVisit для обновления абонемента
    studentsWithoutSubscriptions.forEach((visits) => {
      const subscription = subscriptions.find(
        (subscription) => subscription.student._id.toString() === visits.newVisit.student,
      );

      if (!subscription) return;

      // если статус по визиту уже есть - то добавим только ID абонемента
      if (visits.prevVisit) {
        visits.prevVisit.subscription = subscription._id.toString();
        return;
      }

      // иначе полностью добавим prevVisit
      visits.prevVisit = {
        student: subscription.student,
        visitStatus: VisitStatus.UNKNOWN,
        subscription: subscription._id.toString(),
      };
    });

    /*
    У нас могут быть следующие ситуации:
    
    1) студент был на занятии. Абонемент списался Новый статус - не был на занятии: занятие нужно вернуть
    2) студент не был на занятии. Абонемент не списался. Новый статус - был на занятии: занятие нужно списать
    3) студент был на занятии, абонемент списался. Новый статус - на отработку: занятие нужно добавить в отложенные
    4) студент не был на занятии. Абонемент не списался. Новый статус - на отработку: занятие нужно добавить в отложенные
    5) студент не был на занятии. Статус к отработке. Новый статус -> был на занятии или пропустил: занятие нужно списать с отложенных
    */

    const returnVisit: Array<IPrevAndNextVisits> = [];
    const returnPostponedVisit: Array<IPrevAndNextVisits> = [];
    const addVisit: Array<IPrevAndNextVisits> = [];
    const addPostponedVisit: Array<IPrevAndNextVisits> = [];

    studentsWithChangedStatuses.forEach((visits) => {
      // смотрим какой у него новый статус и сверяем с предыдущим
      switch (visits.newVisit.visitStatus) {
        case VisitStatus.VISITED:
          // новый статус - посещено, ранее был статус К Отработке - нужно вернуть занятие postponedVisit
          // с абонемента занятие уже и так списано
          if (visits.prevVisit?.visitStatus === VisitStatus.POSTPONED) {
            returnPostponedVisit.push(visits);
            break;
          }

          // в остальных случаях занятие не было посещено - нужно списать
          addVisit.push(visits);
          break;

        case VisitStatus.POSTPONED:
          addPostponedVisit.push(visits);

          if (visits.prevVisit?.visitStatus !== VisitStatus.VISITED) {
            addVisit.push(visits);
          }
          break;

        case VisitStatus.UNKNOWN:
        case VisitStatus.MISSED:
        case VisitStatus.SICK:
          // если ранее отмечено что был, а новый статус пропустил - нужно вернуть занятие в абонемент
          if (visits.prevVisit?.visitStatus === VisitStatus.VISITED) {
            returnVisit.push(visits);
            break;
          }

          // если ранее отмечено что К отработке, а новый статус пропустил - нужно вернуть занятие в абонемент и вернуть postponedvisit
          if (visits.prevVisit?.visitStatus === VisitStatus.POSTPONED) {
            returnVisit.push(visits);
            returnPostponedVisit.push(visits);
            break;
          }
          break;
      }
    });

    // добавлям транзакцию для обновления различных статусов абонементов
    const transaction = async (session: ClientSession) => {
      // вернём по 1 визиту в абонементы
      if (returnVisit.length) {
        await this.subscriptionService.updateMany(
          { _id: { $in: returnVisit.map((visit) => visit.prevVisit?.subscription) } },
          { $inc: { visitsLeft: 1 } },
        );
      }

      // вернём по 1 отложенному визиту в абонементы
      if (returnPostponedVisit.length) {
        await this.subscriptionService.updateMany(
          { _id: { $in: returnPostponedVisit.map((visit) => visit.prevVisit?.subscription) } },
          { $inc: { vistsPostponed: 1 } },
        );
      }

      // добавим по 1  визиту в абонементы
      if (addVisit.length) {
        await this.subscriptionService.updateMany(
          { _id: { $in: addVisit.map((visit) => visit.prevVisit?.subscription) } },
          { $inc: { visitsLeft: -1 } },
        );
      }

      // добавим по 1 отложенному визиту в абонементы
      if (addPostponedVisit.length) {
        await this.subscriptionService.updateMany(
          { _id: { $in: addPostponedVisit.map((visit) => visit.prevVisit?.subscription) } },
          { $inc: { visitsLeft: -1 } },
        );
      }

      // обновим занятие и вернём результат
      return await this.visitedLessonModel.findByIdAndUpdate(id, updateVisitedLessonDto, {
        new: true,
      });
    };

    const updated = await withTransaction<VisitedLessonDocument>(
      this.visitedLessonModel,
      // @ts-ignore
      transaction,
    );

    return updated;
  }

  async remove(id: string) {
    await this.visitedLessonModel.findByIdAndRemove(id);
    return;
  }
}
