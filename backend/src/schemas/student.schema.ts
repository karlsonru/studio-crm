import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform, Type } from 'class-transformer';
import { HydratedDocument, Types } from 'mongoose';

export type StudentDocument = HydratedDocument<Student>;

export enum KnowledgeSource {
  VK = 'vk',
  SITE = 'site',
  FRIENDS = 'friends',
  ADVERT_PAPER = 'advert_paper',
  ADVERT_CLINIC = 'advert_clinic',
  OTHER = 'other',
  UNKNOWN = 'unknown',
}

export interface IStudentContact {
  name: string;
  phone: number;
}

@Schema({
  timestamps: true,
})
export class Student {
  @Transform(({ value }) => value.toString())
  @Type(() => String)
  _id: Types.ObjectId;

  @Prop({
    type: String,
    required: true,
    trim: true,
    minlength: 2,
  })
  fullname: string;

  @Prop({
    type: String,
    required: true,
    trim: true,
  })
  sex: string;

  @Prop({
    type: Number,
    required: true,
    default: null,
  })
  birthday: number;

  @Prop({
    type: [
      {
        name: {
          type: String,
          trim: true,
          minlength: 2,
        },
        phone: {
          type: Number,
        },
      },
    ],
  })
  contacts: IStudentContact[];

  @Prop({
    type: String,
    enum: KnowledgeSource,
    default: KnowledgeSource.UNKNOWN,
  })
  knowledgeSource?: KnowledgeSource;

  @Prop({
    type: String,
  })
  comment?: string;
}

export const StudentSchema = SchemaFactory.createForClass(Student);
