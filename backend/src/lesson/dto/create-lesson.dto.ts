import { Type } from 'class-transformer';
import {
  IsEnum,
  IsMongoId,
  IsNumber,
  IsString,
  Max,
  Min,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { ITime } from '../../schemas/lesson.schema';
import { VisitType } from 'src/schemas/visitedLesson.schema';

class Time implements ITime {
  @IsNumber()
  @Min(0)
  @Max(59)
  hh: number;

  @IsNumber()
  @Min(0)
  @Max(59)
  min: number;
}

class VisitingStudent {
  @IsString()
  @IsMongoId()
  student: string;

  @IsEnum(VisitType)
  visitType: VisitType;

  @ValidateIf((obj, value) => value !== null)
  @IsNumber()
  @Min(0)
  date: null | number;
}

export class CreateLessonDto {
  @IsString()
  title: string;

  @IsString()
  @IsMongoId()
  teacher: string;

  @ValidateNested()
  @Type(() => VisitingStudent)
  students: VisitingStudent[];

  @IsString()
  @IsMongoId()
  location: string;

  @IsNumber()
  day: number;

  @ValidateNested()
  @Type(() => Time)
  timeStart: Time;

  @ValidateNested()
  @Type(() => Time)
  timeEnd: Time;

  @IsNumber()
  dateFrom: number;

  @IsNumber()
  dateTo: number;
}
