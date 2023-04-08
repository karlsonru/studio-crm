import { UserEntity } from '../../user/entities/user.entity';
import { StudentEntity } from '../../student/entities/student.entity';
import { Types } from 'mongoose';
import { LocationEntity } from '../../location/entities/location.entity';

export class LessonEntity {
  _id: Types.ObjectId;
  title: string;
  teacher: UserEntity;
  students: StudentEntity[];
  location: LocationEntity;
  day: number;
  timeStart: number;
  timeEnd: number;
  dateFrom: number;
  dateTo: number;
  isActive: boolean;
}
