import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Lesson } from './lesson.schema';
import { User } from './user.schema';
import { Student } from './student.schema';
import { Transform, Type } from 'class-transformer';

export type VisitedLessonDocument = HydratedDocument<VisitedLesson>;

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

export class VisitedStudent {
  student: Student;
  visitStatus: VisitStatus;
  billingStatus: BillingStatus;
  subscription: string | null;
  visitType: VisitType;
}

@Schema({
  timestamps: true,
})
export class VisitedLesson {
  @Transform(({ value }) => value.toString())
  @Type(() => String)
  _id: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'Lesson',
    required: true,
    index: true,
  })
  @Type(() => Lesson)
  lesson: Lesson;

  @Prop({
    type: Number,
    required: true,
    min: 0,
    max: 6,
  })
  day: number;

  @Prop({
    type: Number,
    required: true,
    index: true,
  })
  date: number;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  @Type(() => User)
  teacher: User;

  @Prop({
    type: [
      {
        student: {
          index: true,
          type: Types.ObjectId,
          ref: 'Student',
          required: true,
        },
        visitStatus: {
          type: String,
          enum: VisitStatus,
          default: VisitStatus.UNKNOWN,
          trim: true,
          required: true,
        },
        billingStatus: {
          type: String,
          enum: BillingStatus,
          default: BillingStatus.UNCHARGED,
          trim: true,
          required: true,
        },
        subscription: {
          type: String,
          trim: true,
          default: null,
        },
        visitType: {
          type: String,
          enum: VisitType,
          default: VisitType.REGULAR,
          trim: true,
          required: true,
        },
      },
    ],
  })
  students: VisitedStudent[];
}

export const VisitedLessonSchema = SchemaFactory.createForClass(VisitedLesson);
