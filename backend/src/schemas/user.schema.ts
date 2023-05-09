import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Role } from './role.schema';

export type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: true,
})
export class User {
  _id: Types.ObjectId;

  @Prop({
    type: String,
    required: true,
    minLength: 5,
    unique: true,
    trim: true,
  })
  login: string;

  @Prop({
    type: String,
    required: true,
    minLength: 5,
    trim: true,
  })
  password: string;

  @Prop({
    type: String,
    required: true,
    trim: true,
    minLength: 2,
  })
  fullname: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'Role',
    required: true,
    lowercase: true,
    trim: true,
  })
  role: Role;

  @Prop({
    type: Number,
    required: true,
  })
  birthday: number;

  @Prop({
    type: Number,
    required: true,
  })
  phone: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
