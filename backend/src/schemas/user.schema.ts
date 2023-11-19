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
    minLength: 3,
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
    default: 0,
  })
  salary: number;

  @Prop({
    type: Boolean,
    required: true,
    default: false,
  })
  canAuth: boolean;

  @IsOptional()
  @Prop({
    type: String,
    minLength: 5,
    trim: true,
    index: {
      unique: true,
      partialFilterExpression: {
        login: { $ne: null },
      },
    },
    default: null,
  })
  login?: string;

  @IsOptional()
  @Prop({
    type: String,
    minLength: 10,
    trim: true,
  })
  @Exclude()
  password?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
