import { ILessonModel } from './ILessonModel';

interface IStudentModelContact {
  name: string;
  phone: number;
}

export interface IStudentModel {
  _id: string;
  fullname: string;
  sex: string;
  birthday: number;
  balance: number;
  visitingLessons: Array<ILessonModel>;
  contacts: Array<IStudentModelContact>;
  comment?: string;
  isActive: boolean;
}

export interface IStudentModalCreate extends Omit<IStudentModel, '_id' | 'visitingLessons'> {
  visitingLessons: Array<string>;
}
