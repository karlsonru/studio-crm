import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsMongoId } from 'class-validator';

export class UpdateUserDto extends PartialType(OmitType(CreateUserDto, ['role'] as const)) {
  @IsMongoId()
  role: string;
}
