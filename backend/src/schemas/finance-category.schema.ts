import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform, Type } from 'class-transformer';
import { HydratedDocument, Types } from 'mongoose';

export type FinanceCategoryDocument = HydratedDocument<FinanceCategory>;

@Schema({
  timestamps: true,
})
export class FinanceCategory {
  @Transform(({ value }) => value.toString())
  @Type(() => String)
  _id: Types.ObjectId;

  @Prop({
    type: String,
    required: true,
    trim: true,
    unique: true,
  })
  name: string;
}

export const FinanceCategorySchema = SchemaFactory.createForClass(FinanceCategory);
