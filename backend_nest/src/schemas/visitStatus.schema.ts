import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type VisitStatusDocument = HydratedDocument<VisitStatusModel>;

@Schema({
  timestamps: true,
})
export class VisitStatusModel {
  _id: Types.ObjectId;

  @Prop({
    type: String,
    required: true,
    unique: true,
    trim: true,
  })
  title: string;

  // что делать после сабмита визита с таким статусом?
  @Prop({
    type: String,
    required: true,
    trim: true,
  })
  action: string;

  // что делать после сабмита визита с таким статусом?
  @Prop({
    type: String,
    default: 'success',
    trim: true,
  })
  color: string;
}

export const VisitStatusSchema = SchemaFactory.createForClass(VisitStatusModel);
