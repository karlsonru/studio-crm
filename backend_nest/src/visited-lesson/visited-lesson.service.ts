import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { VisitedLessonEntity } from './entities/visited-lesson.entity';
import { CreateVisitedLessonDto } from './dto/create-visited-lesson.dto';
import { UpdateVisitedLessonDto } from './dto/update-visited-lesson.dto';
import { IFilterQuery } from '../shared/IFilterQuery';
import {
  VisitedLesson,
  VisitedLessonDocument,
} from '../schemas/visitedLesson.schema';

@Injectable()
export class VisitedLessonService {
  constructor(
    @InjectModel(VisitedLesson.name)
    private readonly model: Model<VisitedLessonDocument>,
  ) {}

  async create(
    createVisitedLessonDto: CreateVisitedLessonDto,
  ): Promise<VisitedLessonEntity | null> {
    const candidate = await this.model.findOne({
      $and: [
        { date: createVisitedLessonDto.date },
        { lesson: createVisitedLessonDto.lesson },
      ],
    });

    if (candidate) {
      return null;
    }

    const created = await this.model.create(createVisitedLessonDto);

    return created;
  }

  async findAll(
    query?: IFilterQuery<VisitedLessonEntity>,
  ): Promise<Array<VisitedLessonEntity>> {
    return await this.model.find(query ?? {});
  }

  async findOne(id: string): Promise<VisitedLessonEntity | null> {
    return await this.model.findById(id);
  }

  async update(
    id: string,
    updateVisitedLessonDto: UpdateVisitedLessonDto,
  ): Promise<VisitedLessonEntity | null> {
    const updated = await this.model.findByIdAndUpdate(
      id,
      updateVisitedLessonDto,
      {
        new: true,
      },
    );

    return updated;
  }

  async remove(id: string) {
    await this.model.findByIdAndRemove(id);
    return;
  }
}
