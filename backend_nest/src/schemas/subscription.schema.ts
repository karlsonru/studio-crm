import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { LessonModel } from './lesson.schema';
import { StudentModel } from './student.schema';
import { SubscriptionTemplateModel } from './subscriptionTemplate.schema';

export type SubscriptionDocument = HydratedDocument<SubscriptionModel>;

@Schema({
  timestamps: true,
})
export class SubscriptionModel {
  _id: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'Student',
    required: true,
    index: true,
  })
  student: StudentModel;

  @Prop({
    type: Types.ObjectId,
    ref: 'SubscriptionTemplate',
    required: true,
  })
  template: SubscriptionTemplateModel;

  @Prop({
    type: Types.ObjectId,
    ref: 'Lesson',
    required: true,
    index: true,
    nullable: true,
  })
  lesson: LessonModel;

  @Prop({
    type: Number,
    required: true,
    min: 0,
  })
  visitsLeft: number;

  @Prop({
    type: Number,
    required: true,
  })
  dateFrom: number;

  @Prop({
    type: Number,
    required: true,
  })
  dateTo: number;

  @Prop({
    type: String,
    required: true,
    trim: true,
  })
  paymentMethod: string;
}

export const SubscriptionSchema = SchemaFactory.createForClass(SubscriptionModel);
