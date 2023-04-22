import { Types } from 'mongoose';
import { LessonEntity } from '../../lesson/entities/lesson.entity';
import { UserEntity } from '../../user/entities/user.entity';
import { VisitedStudent } from '../../schemas/visitedLesson.schema';

export class VisitedLessonEntity {
  _id: Types.ObjectId;
  lesson: LessonEntity;
  day: number;
  date: number;
  teacher: UserEntity;
  students: VisitedStudent[];
}
