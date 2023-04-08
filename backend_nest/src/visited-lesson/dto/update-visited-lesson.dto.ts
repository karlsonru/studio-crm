import { PartialType } from '@nestjs/swagger';
import { CreateVisitedLessonDto } from './create-visited-lesson.dto';

export class UpdateVisitedLessonDto extends PartialType(
  CreateVisitedLessonDto,
) {}
