import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from './user.schema';
import { Student } from './student.schema';
import { Location } from './location.schema';

export type LessonDocument = HydratedDocument<Lesson>;

@Schema({
  timestamps: true,
})
export class Lesson {
  _id: Types.ObjectId;

  @Prop({
    required: true,
    trim: true,
  })
  title: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
    trim: true,
  })
  teacher: User;

  @Prop({
    type: [
      {
        type: Types.ObjectId,
        ref: 'Student',
      },
    ],
  })
  students: Student[];

  @Prop({
    type: Types.ObjectId,
    ref: 'Location',
    required: true,
    trim: true,
  })
  location: Location;

  @Prop({
    required: true,
    index: true,
    min: 0,
    max: 6,
  })
  day: number;

  @Prop({
    required: true,
    min: 0,
    max: 2359,
  })
  timeStart: number;

  @Prop({
    required: true,
    min: 0,
    max: 2359,
  })
  timeEnd: number;

  @Prop({
    required: true,
  })
  dateFrom: number;

  @Prop({
    required: true,
  })
  dateTo: number;

  @Prop({
    required: true,
  })
  isActive: boolean;
}

export const LessonSchema = SchemaFactory.createForClass(Lesson);
