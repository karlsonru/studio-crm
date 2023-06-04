import { IsString, IsNotEmpty, MinLength, IsNumber, IsOptional, IsBoolean } from 'class-validator';

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

  @IsOptional()
  @IsNumber()
  salary: number;

  @IsBoolean()
  canAuth: boolean;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  login?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  password?: string;
}
