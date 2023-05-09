import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateVisitStatusDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  title: string;

  @IsString()
  @IsNotEmpty()
  action: string;

  @IsString()
  @IsNotEmpty()
  color: string;
}
