import {
  IsArray,
  IsMongoId,
  IsNumber,
  IsPositive,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { Visit } from '../../schemas/visitedLesson.schema';
import { Type } from 'class-transformer';

export class CreateVisitedLessonDto {
  @IsString()
  @IsMongoId()
  lesson: string;

  @IsNumber()
  @Min(0)
  @Max(6)
  day: number;

  @IsNumber()
  @IsPositive()
  date: number;

  @IsString()
  @IsMongoId()
  teacher: string;

  @IsArray()
  // @ValidateNested({ each: true })
  // @Type(() => Visit)
  students: Visit[];
}
