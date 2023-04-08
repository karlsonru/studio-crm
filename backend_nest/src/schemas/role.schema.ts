import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type RoleDocument = HydratedDocument<Role>;

@Schema({
  timestamps: true,
})
export class Role {
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

export const RoleSchema = SchemaFactory.createForClass(Role);
