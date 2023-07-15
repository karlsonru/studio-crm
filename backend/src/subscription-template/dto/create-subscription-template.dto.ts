import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateSubscriptionTemplateDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  price: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  visits: number;

  /*
  @IsNumber()
  @IsNotEmpty()
  @Min(86_400_000)
  duration: number;
  */
}
