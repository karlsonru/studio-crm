import { Type } from 'class-transformer';
import {
  IsArray,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

class Visit {
  @IsMongoId()
  student: string;

  @IsString()
  visitStatus: string;

  @IsOptional()
  @IsString()
  @IsMongoId()
  subscription: string;
}

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
  @ValidateNested({ each: true })
  @Type(() => Visit)
  students: Visit[];
}
