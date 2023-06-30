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
  @Type(() => VisitedStudent)
  students: VisitedStudent[];
}
