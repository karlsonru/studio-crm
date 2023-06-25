import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateLessonDto, VisitingStudent } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { LessonModel, LessonDocument } from '../schemas';
import { IFilterQuery } from '../shared/IFilterQuery';
import { logger } from '../shared/logger.middleware';

export type action = 'add' | 'remove';

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
    return await this.lessonModel
      .find(query ?? {})
      .populate(this.populateQuery)
      .sort({ day: 1, 'timeStart.hh': 1, 'timeStart.min': 1 });
  }

  async findOne(id: string): Promise<LessonModel | null> {
    return await this.lessonModel.findById(id).populate(this.populateQuery);
  }

  async updateStudents(
    id: string,
    updateLessonDto: UpdateLessonDto,
    action: action,
  ): Promise<LessonModel | null> {
    logger.info(`Запрос на изменение студентов ${action} занятия с ID ${id}`);

    if (action === 'remove') {
      const removeQuery = {
        $pull: {
          students: { student: { $in: updateLessonDto.students } },
        },
      };

      const updated = await this.lessonModel.findByIdAndUpdate(id, removeQuery, { new: true });

      return updated;
    }

    // в случае добавления нужно убедиться что не добавляем уже имеющихся в занятии студентов
    const lesson = await this.findOne(id);

    // соберём ID текущих студентов
    const actualStudentsIds = lesson?.students.map((visitinStudent) =>
      visitinStudent.student._id.toString(),
    );

    // проверим ID каждого будущего студента чтобы его не было в занятии
    const futureStudents = (updateLessonDto.students as Array<VisitingStudent>).filter(
      (candidate) => !actualStudentsIds?.includes(candidate.student),
    );

    // добавим только отфильтрованных студентов
    const addQuery = {
      $addToSet: {
        students: { $each: futureStudents },
      },
    };

    const updated = await this.lessonModel.findByIdAndUpdate(id, addQuery, { new: true });

    return updated;
  }

  async update(id: string, updateLessonDto: UpdateLessonDto): Promise<LessonModel | null> {
    logger.info(`Получен запрос на обновление занятия с ID ${id}`);
    const updated = await this.lessonModel.findByIdAndUpdate(id, updateLessonDto, {
      new: true,
    });

    return updated;
  }

  async remove(id: string) {
    const deleted = await this.lessonModel.findByIdAndRemove(id);
    return deleted;
  }
}
