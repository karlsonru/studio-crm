import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { IsOptional } from 'class-validator';
import { Exclude, Transform, Type } from 'class-transformer';

export type UserDocument = HydratedDocument<User>;

export enum UserRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  TEACHER = 'teacher',
  OTHER = 'other',
}

@Schema({
  timestamps: true,
})
export class User {
  @Transform(({ value }) => value.toString())
  @Type(() => String)
  _id: Types.ObjectId;

  @Prop({
    type: String,
    required: true,
    unique: true,
    trim: true,
    minLength: 2,
  })
  fullname: string;

  @Prop({
    type: String,
    enum: UserRole,
    default: UserRole.TEACHER,
    trim: true,
    required: true,
  })
  role: UserRole;

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

  @IsOptional()
  @Prop({
    type: Number,
  })
  salary: number;

  @IsOptional()
  @Prop({
    type: String,
    required: true,
    minLength: 5,
    unique: true,
    trim: true,
  })
  login: string;

  @IsOptional()
  @Prop({
    type: String,
    required: true,
    minLength: 5,
    trim: true,
  })
  @Exclude()
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
