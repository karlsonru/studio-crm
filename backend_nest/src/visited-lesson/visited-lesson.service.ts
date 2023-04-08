import { Injectable } from '@nestjs/common';
import { CreateVisitedLessonDto } from './dto/create-visited-lesson.dto';
import { UpdateVisitedLessonDto } from './dto/update-visited-lesson.dto';

@Injectable()
export class VisitedLessonService {
  create(createVisitedLessonDto: CreateVisitedLessonDto) {
    return 'This action adds a new visitedLesson';
  }

  findAll() {
    return `This action returns all visitedLesson`;
  }

  findOne(id: number) {
    return `This action returns a #${id} visitedLesson`;
  }

  update(id: number, updateVisitedLessonDto: UpdateVisitedLessonDto) {
    return `This action updates a #${id} visitedLesson`;
  }

  remove(id: number) {
    return `This action removes a #${id} visitedLesson`;
  }
}
