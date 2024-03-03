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
import { VisitStatus, VisitType } from '../../schemas/attendance.schema';

export class VisitedStudent {
  @IsString()
  @IsMongoId()
  student: string;

  @IsString()
  visitStatus: VisitStatus;

  @IsString()
  visitType: VisitType;

  @IsOptional()
  @IsString()
  visitInstead?: string | null;
}

export class CreateAttendanceDto {
  @IsString()
  @IsMongoId()
  lesson: string;

  @IsNumber()
  @IsPositive()
  year: number;

  @IsNumber()
  @IsPositive()
  @Min(1)
  @Max(12)
  month: number;

  @IsNumber()
  @IsPositive()
  @Min(1)
  @Max(31)
  day: number;

  @IsNumber()
  @IsPositive()
  @Min(0)
  @Max(6)
  weekday: number;

  @IsString()
  @IsMongoId()
  teacher: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VisitedStudent)
  students: VisitedStudent[];
}
