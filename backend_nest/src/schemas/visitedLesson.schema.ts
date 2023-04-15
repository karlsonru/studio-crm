import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { LessonModel } from './lesson.schema';
import { UserModel } from './user.schema';
import { StudentModel } from './student.schema';

export type VisitedLessonDocument = HydratedDocument<VisitedLessonModel>;

export class VisitModel {
  student: StudentModel;
  visitStatus: string;
  // student: Types.ObjectId;
  // visitStatus: Types.ObjectId;
}

@Schema({
  timestamps: true,
})
export class VisitedLessonModel {
  _id: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'Lesson',
    required: true,
    index: true,
  })
  lesson: LessonModel;

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
  teacher: UserModel;

  @Prop({
    type: [
      {
        student: {
          type: Types.ObjectId,
          ref: 'Student',
          required: true,
        },
        visitStatus: {
          type: String,
          trim: true,
          /*
          type: Types.ObjectId,
          ref: 'VisitStatus',
          */
        },
      },
    ],
  })
  students: VisitModel[];
}

export const VisitedLessonSchema = SchemaFactory.createForClass(VisitedLessonModel);
