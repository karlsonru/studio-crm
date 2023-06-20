import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { LessonModel, LessonDocument } from '../schemas';
import { IFilterQuery } from '../shared/IFilterQuery';
import { logger } from '../shared/logger.middleware';

@Injectable()
export class LessonService {
  private readonly populateQuery: Array<string>;

  constructor(
    @InjectModel(LessonModel.name)
    private readonly lessonModel: Model<LessonDocument>,
  ) {
    this.populateQuery = ['teacher', 'location', 'students.student'];
  }

  async create(createLessonDto: CreateLessonDto): Promise<LessonModel | null> {
    const isExists = await this.lessonModel.findOne({
      fullname: createLessonDto,
    });

    if (isExists) {
      return null;
    }

    const created = await this.lessonModel.create(createLessonDto);

    return created;
  }

  async findAll(query?: IFilterQuery<LessonModel>): Promise<Array<LessonModel>> {
    return await this.lessonModel.find(query ?? {}).populate(this.populateQuery);
  }

  async findOne(id: string): Promise<LessonModel | null> {
    return await this.lessonModel.findById(id).populate(this.populateQuery);
  }

  async update(id: string, updateLessonDto: UpdateLessonDto): Promise<LessonModel | null> {
    logger.info(`Получен запрос на обновление занятия с ID ${id}`);
    console.log(updateLessonDto);
    const updated = await this.lessonModel.findByIdAndUpdate(id, updateLessonDto, {
      new: true,
    });

    console.log(updated);

    return updated;
  }

  async remove(id: string) {
    const deleted = await this.lessonModel.findByIdAndRemove(id);
    return deleted;
  }
}
