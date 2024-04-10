import { Type } from 'class-transformer';
import {
  ArrayUnique,
  IsMongoId,
  // IsNotEmpty,
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

  /*
  @IsString()
  @IsNotEmpty()
  template: string;
  */

  @Type(() => String)
  @IsMongoId({ each: true })
  @ArrayUnique()
  lessons: [string];

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(0)
  visitsTotal: number;

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
