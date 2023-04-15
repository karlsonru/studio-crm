import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model, PopulateOptions } from 'mongoose';
import { VisitedLessonEntity } from './entities/visited-lesson.entity';
import { CreateVisitedLessonDto } from './dto/create-visited-lesson.dto';
import { UpdateVisitedLessonDto } from './dto/update-visited-lesson.dto';
import { IFilterQuery } from '../shared/IFilterQuery';
import { VisitedLessonModel, VisitedLessonDocument } from '../schemas';
import { withTransaction } from '../shared/withTransaction';
import { SubscriptionService } from '../subscription/subscription.service';

const enum VisitStatus {
  VISITED = 'visited',
  POSTPONED = 'postponed',
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
      const updateSubscriptions = {
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

    const created = await withTransaction(this.visitedLessonModel, transaction);

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
    const updated = await this.visitedLessonModel.findByIdAndUpdate(id, updateVisitedLessonDto, {
      new: true,
    });

    return updated;
  }

  async remove(id: string) {
    await this.visitedLessonModel.findByIdAndRemove(id);
    return;
  }
}
