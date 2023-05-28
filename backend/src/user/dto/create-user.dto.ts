import { IsString, IsNotEmpty, MinLength, IsNumber, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  fullname: string;

  @IsString()
  @IsNotEmpty()
  role: string;

  @IsNumber()
  @IsNotEmpty()
  birthday: number;

  @IsNumber()
  @IsNotEmpty()
  phone: number;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @IsOptional()
  login?: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @IsOptional()
  password?: string;

  @IsOptional()
  @IsNumber()
  salary: number;
}
