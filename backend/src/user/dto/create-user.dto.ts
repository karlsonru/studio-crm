import { IsString, IsNotEmpty, MinLength, IsMongoId, IsNumber } from 'class-validator';
import { ObjectId } from 'mongodb';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  login: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  password: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  fullname: string;

  @IsNotEmpty()
  @IsMongoId()
  role: ObjectId;

  @IsNumber()
  @IsNotEmpty()
  birthday: number;

  @IsNumber()
  @IsNotEmpty()
  phone: number;
}
