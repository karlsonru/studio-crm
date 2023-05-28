import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform, Type } from 'class-transformer';
import { HydratedDocument, Types } from 'mongoose';

export type LocationDocument = HydratedDocument<Location>;

@Schema({
  timestamps: true,
})
export class Location {
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
    type: String,
    required: true,
    unique: true,
    trim: true,
  })
  address: string;

  @Prop({
    type: String,
    trim: true,
  })
  description?: string;
}

export const LocationSchema = SchemaFactory.createForClass(Location);
