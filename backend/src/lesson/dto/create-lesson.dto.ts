import { Type } from 'class-transformer';
import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { ITime } from '../../schemas/lesson.schema';
import { VisitType } from '../../schemas/attendance.schema';

class Time implements ITime {
  @IsNumber()
  @Min(0)
  @Max(24)
  hh: number;

  @IsNumber()
  @Min(0)
  @Max(59)
  min: number;
}

export class VisitingStudent {
  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  student: string;

  @IsNotEmpty()
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

  @ValidateNested({ each: true })
  @Type(() => VisitingStudent)
  students: VisitingStudent[];

  @IsString()
  @IsMongoId()
  location: string;

  @IsNumber()
  weekday: number;

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

  @IsOptional()
  @IsString()
  color?: number;
}
