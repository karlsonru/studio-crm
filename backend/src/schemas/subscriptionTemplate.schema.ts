import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform, Type } from 'class-transformer';
import { HydratedDocument, Types } from 'mongoose';

export type SubscriptionTemplateDocument = HydratedDocument<SubscriptionTemplate>;

@Schema({
  timestamps: true,
})
export class SubscriptionTemplate {
  @Transform(({ value }) => value.toString())
  @Type(() => String)
  _id: Types.ObjectId;

  @Prop({
    type: String,
    required: true,
    unique: true,
    trim: true,
  })
  title: string;

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
    min: 86_400_000,
  })
  duration: number;
}

export const SubscriptionTemplateSchema = SchemaFactory.createForClass(SubscriptionTemplate);
