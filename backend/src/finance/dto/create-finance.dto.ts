import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateFinanceCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class CreateFinanceDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNumber()
  date: number;

  @IsNumber()
  amount: number;

  @IsString()
  categoryName: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  comment?: string;
}
