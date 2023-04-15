import { Types } from 'mongoose';
import { LessonEntity } from '../../lesson/entities/lesson.entity';
import { StudentEntity } from '../../student/entities/student.entity';
import { SubscriptionTemplateEntity } from '../../subscription-template/entities/subscription-template.entity';

export class SubscriptionEntity {
  _id: Types.ObjectId;
  student: StudentEntity;
  template: SubscriptionTemplateEntity;
  lesson: LessonEntity;
  visitsLeft: number;
  dateFrom: number;
  dateTo: number;
  paymentMethod: string;
}
