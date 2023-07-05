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
import { BillingStatus, VisitStatus, VisitType } from '../../schemas/attendance.schema';

export class VisitedStudent {
  @IsMongoId()
  student: string;

  @IsString()
  visitStatus: VisitStatus;

  @IsOptional()
  @IsString()
  billingStatus: BillingStatus;

  @IsOptional()
  @IsString()
  subscription: string | null;

  @IsString()
  visitType: VisitType;
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
