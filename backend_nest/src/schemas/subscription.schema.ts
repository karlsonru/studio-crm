import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Lesson } from './lesson.schema';
import { Student } from './student.schema';
import { SubscriptionTemplate } from './subscriptionTemplate.schema';

export type SubscriptionDocument = HydratedDocument<Subscription>;

@Schema({
  timestamps: true,
})
export class Subscription {
  _id: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'Student',
    required: true,
    index: true,
  })
  student: Student;

  @Prop({
    type: Types.ObjectId,
    ref: 'SubscriptionTemplate',
    required: true,
  })
  template: SubscriptionTemplate;

  @Prop({
    type: Types.ObjectId,
    ref: 'Lesson',
    required: true,
    index: true,
    nullable: true,
  })
  lesson: Lesson | null;

  @Prop({
    type: Number,
    required: true,
    min: 0,
  })
  price: number;

  @Prop({
    type: Number,
    required: true,
    min: 1,
  })
  visits: number;

  @Prop({
    type: Number,
    required: true,
    min: 0,
  })
  visitsLeft: number;

  @Prop({
    type: Number,
    required: true,
    min: 86_400_000,
  })
  duration: number;

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

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);
