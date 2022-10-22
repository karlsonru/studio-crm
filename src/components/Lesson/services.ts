import { Lesson } from '../../models';
import { ILesson } from './types';

export class LessonServices {
  static async getLessons() {
    const lessons = await Lesson.find({});
    return lessons;
  }

  static async getLesson(lessonId: string) {
    const lesson = await Lesson.findById({ lessonId });
    return lesson;
  }

  static async findLessons(query: ILesson, limit: number) {
    const lessons = await Lesson.find(query).limit(limit);
    return lessons;
  }

  static async create(lesson: ILesson) {
    // проверим что в указанный день этому педагогу не назначен другой урок
    const candidate = await this.findLessons({
      day: lesson.day,
      teacher: lesson.teacher,
      timeHh: lesson.timeHh,
      timeMin: lesson.timeMin,
    }, 1);

    if (candidate) {
      return null;
    }

    const newLesson = await Lesson.create(lesson);

    return newLesson;
  }

  static async update(id: string, lesson: ILesson) {
    const updatedLesson = await Lesson.findOneAndUpdate({ id }, lesson, { returnDocument: 'after' });
    return updatedLesson;
  }

  static async delete(id: string) {
    const removeLesson = await Lesson.findOneAndDelete({ id });
    return removeLesson;
  }
}
