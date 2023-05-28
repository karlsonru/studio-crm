import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateLocationDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  address: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  description?: string;
}
