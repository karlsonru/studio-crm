import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { IStudentContact, KnowledgeSource } from '../../schemas/student.schema';

export class CreateStudentDto {
  @IsString()
  @MinLength(2)
  fullname: string;

  @IsString()
  @IsNotEmpty()
  sex: string;

  @IsNumber()
  birthday: number;

  @IsArray()
  @ArrayMinSize(1)
  contacts: IStudentContact[];

  @IsOptional()
  @IsEnum(KnowledgeSource)
  knowledgeSource?: KnowledgeSource;

  @IsOptional()
  @IsString()
  comment?: string;
}
