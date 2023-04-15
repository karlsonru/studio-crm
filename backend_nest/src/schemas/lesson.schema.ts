import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { UserModel } from './user.schema';
import { StudentModel } from './student.schema';
import { LocationModel } from './location.schema';

export type LessonDocument = HydratedDocument<LessonModel>;

@Schema({
  timestamps: true,
})
export class LessonModel {
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
  teacher: UserModel;

  @Prop({
    type: [
      {
        type: Types.ObjectId,
        ref: 'Student',
      },
    ],
  })
  students: StudentModel[];

  @Prop({
    type: Types.ObjectId,
    ref: 'Location',
    required: true,
    trim: true,
  })
  location: LocationModel;

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

export const LessonSchema = SchemaFactory.createForClass(LessonModel);
