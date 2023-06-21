import { IsArray } from 'class-validator';
import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateLessonDto, VisitingStudent } from './create-lesson.dto';

export class UpdateLessonDto extends PartialType(OmitType(CreateLessonDto, ['students'])) {
  @IsArray()
  students: Array<VisitingStudent | string>;
}
