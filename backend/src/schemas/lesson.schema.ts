import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from './user.schema';
import { Student } from './student.schema';
import { Location } from './location.schema';
import { Transform, Type } from 'class-transformer';
import { Attendance, VisitType } from './attendance.schema';

export type LessonDocument = HydratedDocument<Lesson>;

export class ITime {
  hh: number;
  min: number;
}

@Schema({ _id: false })
class VisitingStudent {
  @Prop({
    type: Types.ObjectId,
    ref: 'Student',
    required: true,
  })
  @Type(() => Student)
  student: Student;

  @Prop({
    type: Number,
    default: null,
    required: true,
  })
  date: number | null;

  @Prop({
    type: String,
    enum: VisitType,
    default: VisitType.REGULAR,
    required: true,
  })
  visitType: VisitType;

  @Prop({
    type: Types.ObjectId,
    ref: 'Attendance',
    required: false,
  })
  @Type(() => Attendance)
  visitInstead?: Attendance;
}

@Schema({ timestamps: true })
export class Lesson {
  @Transform(({ value }) => value.toString())
  @Type(() => String)
  _id: Types.ObjectId;

  @Prop({
    required: true,
    trim: true,
  })
  title: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    trim: true,
    required: true,
  })
  @Type(() => User)
  teacher: User;

  @Prop({
    type: Types.ObjectId,
    ref: 'Student',
    required: true,
  })
  @Type(() => VisitingStudent)
  students: VisitingStudent[];

  @Prop({
    type: Types.ObjectId,
    ref: 'Location',
    required: true,
    trim: true,
  })
  @Type(() => Location)
  location: Location;

  @Prop({
    required: true,
    index: true,
    min: 0,
    max: 6,
  })
  weekday: number;

  @Prop({
    required: true,
    type: Object,
  })
  timeStart: ITime;

  @Prop({
    required: true,
    type: Object,
  })
  timeEnd: ITime;

  @Prop({
    required: true,
  })
  dateFrom: number;

  @Prop({
    required: true,
  })
  dateTo: number;

  @Prop({
    type: String,
  })
  color?: string;
}

export const LessonSchema = SchemaFactory.createForClass(Lesson);
