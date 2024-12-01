import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform, Type } from 'class-transformer';
import { HydratedDocument, Types } from 'mongoose';
import { Location } from './location.schema';

export type FinanceDocument = HydratedDocument<Finance>;

@Schema({
  timestamps: true,
})
export class Finance {
  @Transform(({ value }) => value.toString())
  @Type(() => String)
  _id: Types.ObjectId;

  @Prop({
    type: String,
    required: true,
    trim: true,
  })
  title: string;

  @Prop({
    type: Number,
    required: true,
    index: true,
    trim: true,
  })
  date: number;

  @Prop({
    type: Number,
    required: true,
  })
  amount: number;

  @Prop({
    type: String,
    trim: true,
  })
  categoryName: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'Location',
  })
  @Type(() => Location)
  location?: Location;

  @Prop({
    type: String,
    trim: true,
  })
  comment?: string;
}

export const FinanceSchema = SchemaFactory.createForClass(Finance);
