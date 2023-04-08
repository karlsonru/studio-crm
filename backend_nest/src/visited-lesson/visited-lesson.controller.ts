import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { VisitedLessonService } from './visited-lesson.service';
import { CreateVisitedLessonDto } from './dto/create-visited-lesson.dto';
import { UpdateVisitedLessonDto } from './dto/update-visited-lesson.dto';

@Controller('visited-lesson')
export class VisitedLessonController {
  constructor(private readonly visitedLessonService: VisitedLessonService) {}

  @Post()
  create(@Body() createVisitedLessonDto: CreateVisitedLessonDto) {
    return this.visitedLessonService.create(createVisitedLessonDto);
  }

  @Get()
  findAll() {
    return this.visitedLessonService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.visitedLessonService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVisitedLessonDto: UpdateVisitedLessonDto) {
    return this.visitedLessonService.update(+id, updateVisitedLessonDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.visitedLessonService.remove(+id);
  }
}
