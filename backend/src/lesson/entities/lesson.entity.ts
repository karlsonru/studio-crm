import { UserEntity } from '../../user/entities/user.entity';
import { StudentEntity } from '../../student/entities/student.entity';
import { Types } from 'mongoose';
import { LocationEntity } from '../../location/entities/location.entity';
import { ITime } from '../../schemas/lesson.schema';

export class LessonEntity {
  _id: Types.ObjectId;
  title: string;
  teacher: UserEntity;
  students: StudentEntity[];
  location: LocationEntity;
  day: number;
  timeStart: ITime;
  timeEnd: ITime;
  dateFrom: number;
  dateTo: number;
  isActive: boolean;
}
