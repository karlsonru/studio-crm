import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { LessonEntity } from './entities/lesson.entity';
import { Lesson, LessonDocument } from '../schemas/lesson.schema';
import { IFilterQuery } from '../shared/IFilterQuery';

@Injectable()
export class LessonService {
  private readonly populateQuery: Array<string>;

  constructor(
    @InjectModel(Lesson.name)
    private readonly model: Model<LessonDocument>,
  ) {
    this.populateQuery = ['teacher', 'students', 'location'];
  }

  async create(createLessonDto: CreateLessonDto): Promise<LessonEntity | null> {
    const isExists = await this.model.findOne({
      fullname: createLessonDto,
    });

    if (isExists) {
      return null;
    }

    const created = await this.model.create(createLessonDto);

    return created;
  }

  async findAll(
    query?: IFilterQuery<LessonEntity>,
  ): Promise<Array<LessonEntity>> {
    return await this.model.find(query ?? {}).populate(this.populateQuery);
  }

  async findOne(id: string): Promise<LessonEntity | null> {
    return await this.model.findById(id).populate(this.populateQuery);
  }

  async update(
    id: string,
    updateLessonDto: UpdateLessonDto,
  ): Promise<LessonEntity | null> {
    const updated = await this.model.findByIdAndUpdate(id, updateLessonDto, {
      new: true,
    });

    return updated;
  }

  async remove(id: string) {
    await this.model.findByIdAndRemove(id);
    return;
  }
}
