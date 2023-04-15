import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Lesson } from './lesson.schema';
import { User } from './user.schema';
import { Student } from './student.schema';

export type VisitedLessonDocument = HydratedDocument<VisitedLesson>;

export class Visit {
  student: Student;
  visitStatus: string;
  // student: Types.ObjectId;
  // visitStatus: Types.ObjectId;
}

@Schema({
  timestamps: true,
})
export class VisitedLesson {
  _id: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'Lesson',
    required: true,
    index: true,
  })
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
  teacher: User;

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
  students: Visit[];
}

export const VisitedLessonSchema = SchemaFactory.createForClass(VisitedLesson);
