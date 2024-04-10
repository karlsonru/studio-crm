import { IsArray, IsOptional } from 'class-validator';
import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateLessonDto, VisitingStudent } from './create-lesson.dto';

export class UpdateLessonDto extends PartialType(OmitType(CreateLessonDto, ['students'])) {
  @IsOptional()
  @IsArray()
  students: Array<VisitingStudent | string | null>;
}
