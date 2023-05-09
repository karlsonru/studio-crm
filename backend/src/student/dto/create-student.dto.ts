import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { IStudentContact } from '../../schemas/student.schema';

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
  @IsString()
  source?: string;
}
