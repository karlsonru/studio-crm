import { IsMongoId, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateFinanceDto {
  @IsString()
  title: string;

  @IsNumber()
  date: number;

  @IsNumber()
  amount: number;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsMongoId()
  location?: string;

  @IsOptional()
  @IsString()
  comment?: string;
}
