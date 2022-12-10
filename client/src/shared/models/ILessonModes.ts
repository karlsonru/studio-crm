export interface ILessonModel {
  _id: string;
  title: string;
  day: number;
  teacher: {
    name: string;
    _id: string;
  };
  timeStart: number;
  timeEnd: number;
  activeStudents: number;
  dateFrom: number;
  dateTo: number;
  isActive: boolean;
}
