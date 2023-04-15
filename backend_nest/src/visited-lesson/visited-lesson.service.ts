import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PopulateOptions } from 'mongoose';
import { VisitedLessonEntity } from './entities/visited-lesson.entity';
import { CreateVisitedLessonDto } from './dto/create-visited-lesson.dto';
import { UpdateVisitedLessonDto } from './dto/update-visited-lesson.dto';
import { IFilterQuery } from '../shared/IFilterQuery';
import { VisitedLessonModel, VisitedLessonDocument } from '../schemas';
import { SubscriptionModel, SubscriptionDocument } from '../schemas';

@Injectable()
export class VisitedLessonService {
  private readonly populateQueryVisitedLesson: Array<string | PopulateOptions>;

  constructor(
    @InjectModel(VisitedLessonModel.name)
    private readonly visitedLessonModel: Model<VisitedLessonDocument>,
    @InjectModel(SubscriptionModel.name)
    private readonly subscriptionModel: Model<SubscriptionDocument>,
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

    const created = await this.visitedLessonModel.create(createVisitedLessonDto);

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
