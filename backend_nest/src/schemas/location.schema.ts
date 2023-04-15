import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type LocationDocument = HydratedDocument<LocationModel>;

@Schema({
  timestamps: true,
})
export class LocationModel {
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

export const LocationSchema = SchemaFactory.createForClass(LocationModel);
