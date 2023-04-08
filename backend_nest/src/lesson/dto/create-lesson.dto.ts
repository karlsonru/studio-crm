import { Type } from 'class-transformer';
import {
  ArrayUnique,
  IsBoolean,
  IsMongoId,
  IsNumber,
  IsString,
} from 'class-validator';

export class CreateLessonDto {
  @IsString()
  title: string;

  @IsString()
  @IsMongoId()
  teacher: string;

  @Type(() => String)
  @IsMongoId({ each: true })
  @ArrayUnique()
  students: string[];

  @IsString()
  @IsMongoId()
  location: string;

  @IsNumber()
  day: number;

  @IsNumber()
  timeStart: number;

  @IsNumber()
  timeEnd: number;

  @IsNumber()
  dateFrom: number;

  @IsNumber()
  dateTo: number;

  @IsBoolean()
  isActive: boolean;
}
