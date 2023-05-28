import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Role, RoleSchema } from './role.schema';
import { IsOptional } from 'class-validator';
import { Exclude, Transform, Type } from 'class-transformer';

export type UserDocument = HydratedDocument<User>;

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

  @Prop({ type: RoleSchema })
  @Type(() => Role)
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

  @IsOptional()
  @Prop({
    type: Number,
  })
  salaryRate: number;

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
