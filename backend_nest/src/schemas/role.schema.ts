import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type RoleDocument = HydratedDocument<RoleModel>;

@Schema({
  timestamps: true,
})
export class RoleModel {
  _id: Types.ObjectId;

  @Prop({
    type: String,
    required: true,
    unique: true,
    default: 'teacher',
    lowercase: true,
    trim: true,
  })
  value: string;
}

export const RoleSchema = SchemaFactory.createForClass(RoleModel);
