import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Lesson } from './lesson.schema';
import { Student } from './student.schema';
import { SubscriptionTemplate } from './subscriptionTemplate.schema';
import { Transform, Type } from 'class-transformer';

export type SubscriptionDocument = HydratedDocument<Subscription>;

@Schema({
  timestamps: true,
})
export class Subscription {
  @Transform(({ value }) => value.toString())
  @Type(() => String)
  _id: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'Student',
    required: true,
    index: true,
  })
  @Type(() => Student)
  student: Student;

  @Prop({
    type: Types.ObjectId,
    ref: 'SubscriptionTemplate',
    required: true,
  })
  @Type(() => SubscriptionTemplate)
  template: SubscriptionTemplate;

  @Prop({
    type: Types.ObjectId,
    ref: 'Lesson',
    required: true,
    index: true,
    nullable: true,
  })
  @Type(() => Lesson)
  lesson: Lesson;

  @Prop({
    type: Number,
    required: true,
    min: 0,
  })
  visitsLeft: number;

  @Prop({
    type: Number,
    min: 0,
    index: true,
  })
  visitsPostponed: number;

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
