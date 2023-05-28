import {
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';

export class CreateSubscriptionDto {
  @IsString()
  @IsMongoId()
  student: string;

  @IsString()
  @IsNotEmpty()
  template: string;

  @IsOptional()
  @IsString()
  @IsMongoId()
  lesson: string | null;

  @IsNumber()
  @Min(0)
  visitsLeft: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  visitsPostponed: number;

  @IsNumber()
  @IsPositive()
  dateFrom: number;

  @IsNumber()
  @IsPositive()
  dateTo: number;

  @IsOptional()
  @IsString()
  paymentMethod: string;
}
