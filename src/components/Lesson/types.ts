export interface ILesson {
  id?: string;
  title?: string;
  teacher?: string;
  location?: string;
  day?: number;
  timeHh?: number;
  timeMin?: number;
  timeDuration?: number;
  isActive?: boolean;
}
