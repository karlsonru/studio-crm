import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type VisitStatusDocument = HydratedDocument<VisitStatus>;

@Schema({
  timestamps: true,
})
export class VisitStatus {
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
}

export const VisitStatusSchema = SchemaFactory.createForClass(VisitStatus);
