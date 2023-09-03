import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Student } from './student.schema';
import { Transform, Type } from 'class-transformer';
import { Lesson } from './lesson.schema';

export type AttendanceDocument = HydratedDocument<Attendance>;

export enum VisitStatus {
  UNKNOWN = 'unknown',
  VISITED = 'visited',
  POSTPONED = 'postponed',
  MISSED = 'missed',
  SICK = 'sick',
}

export enum BillingStatus {
  PAID = 'paid',
  UNPAID = 'unpaid',
  UNCHARGED = 'uncharged',
}

export enum VisitType {
  REGULAR = 'regular',
  MISSED_REGULAR = 'missedRegular',
  SINGLE = 'single',
  NEW = 'new',
}

@Schema({
  timestamps: true,
})
export class Attendance {
  @Transform(({ value }) => value.toString())
  @Type(() => String)
  _id: Types.ObjectId;

  @Prop({
    type: Number,
    required: true,
    index: true,
  })
  date: number;

  @Prop({
    type: Number,
    required: true,
    min: 0,
    max: 6,
  })
  day: number;

  @Prop({
    type: Types.ObjectId,
    ref: 'Lesson',
    required: true,
    index: true,
  })
  @Type(() => Lesson)
  lesson: Lesson;

  @Prop({
    type: Types.ObjectId,
    ref: 'Student',
    required: true,
    index: true,
  })
  @Type(() => Student)
  student: Student;

  @Prop({
    type: String,
    enum: VisitStatus,
    default: VisitStatus.UNKNOWN,
    trim: true,
    required: true,
  })
  visitStatus: VisitStatus;

  @Prop({
    type: String,
    enum: BillingStatus,
    default: BillingStatus.UNCHARGED,
    trim: true,
    required: true,
  })
  billingStatus: BillingStatus;

  @Prop({
    type: String,
    enum: VisitType,
    default: VisitType.REGULAR,
    trim: true,
    required: true,
  })
  visitType: VisitType;

  @Prop({
    type: String,
    trim: true,
    default: null,
  })
  subscription: string | null;
}

export const AttendanceSchema = SchemaFactory.createForClass(Attendance);
