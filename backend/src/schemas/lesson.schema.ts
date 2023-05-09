import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from './user.schema';
import { Student } from './student.schema';
import { Location } from './location.schema';

export type LessonDocument = HydratedDocument<Lesson>;

/*
interface IStudentsPermament {
  studentId: Types.ObjectId;
}

interface IStudentsTemp {
  studentId: string;
  subscriptionId: string;
  reason: 'postponed' | 'oneVisit' | 'new'; // если reason postponed - спишем из занятия postponed этого абонемента, если занятие oneVisit - спишем с обычного занятия абонемента
}

interface IStudents {
  permament: IStudentsPermament;
  temp: IStudentsTemp;
}


после того как будет создан visitedLesson
и будет списано занятие с абонемента ученика
мы удалим его из списка temp студентов
как мы узнаем, этот студент "Новый?" или у него абонемент на 1 занятие (однократный) или это отработка? 
*/

export class ITime {
  hh: number;
  min: number;
}

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
    required: true,
  })
  isActive: boolean;
}

export const LessonSchema = SchemaFactory.createForClass(Lesson);
