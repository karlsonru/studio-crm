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
  @Min(1)
  price: number;

  @IsNumber()
  @Min(1)
  visits: number;

  @IsNumber()
  @Min(0)
  visitsLeft: number;

  @IsNumber()
  @Min(86_400_000)
  duration: number;

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
