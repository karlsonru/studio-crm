import { PartialType } from '@nestjs/mapped-types';
import { CreateVisitedLessonDto } from './create-visited-lesson.dto';

export class UpdateVisitedLessonDto extends PartialType(CreateVisitedLessonDto) {}
