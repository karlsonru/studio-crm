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
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  comment?: string;
}
