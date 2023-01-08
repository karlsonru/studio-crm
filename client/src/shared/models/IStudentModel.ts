import { ILessonModel } from './ILessonModel';

interface IStudentModelContact {
  name: string;
  phone: number;
}

export interface IStudentModel {
  _id: string;
  name: string;
  surname: string;
  sex: string;
  birthday: number;
  balance: number;
  visitingLessons: Array<ILessonModel>;
  contacts: Array<IStudentModelContact>;
  isActive: boolean;
}

export interface IStudentModalCreate extends Omit<IStudentModel, '_id'> {}
