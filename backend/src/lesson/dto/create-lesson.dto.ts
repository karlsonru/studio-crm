import { Type } from 'class-transformer';
import {
  ArrayUnique,
  IsBoolean,
  IsMongoId,
  IsNumber,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { ITime } from '../../schemas/lesson.schema';

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

  @IsBoolean()
  isActive: boolean;
}
