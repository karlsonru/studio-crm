import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { VisitedLessonService } from './visited-lesson.service';
import { CreateVisitedLessonDto } from './dto/create-visited-lesson.dto';
import { UpdateVisitedLessonDto } from './dto/update-visited-lesson.dto';
import { ValidateIdPipe } from '../shared/validaitonPipe';

@Controller('visits')
export class VisitedLessonController {
  constructor(private readonly service: VisitedLessonService) {}

  @Post()
  async create(@Body() createVisitedLessonDto: CreateVisitedLessonDto) {
    const created = await this.service.create(createVisitedLessonDto);

    if (created === null) {
      throw new HttpException({ message: 'Уже существует' }, HttpStatus.BAD_REQUEST);
    }

    return created;
  }

  @Get()
  async findAll(@Query('filter') filter?: string) {
    return await this.service.findAll(filter ? JSON.parse(filter) : {});
  }

  @Get(':id')
  async findOne(@Param('id', ValidateIdPipe) id: string) {
    const candidate = await this.service.findOne(id);

    if (candidate === null) {
      throw new HttpException({ message: 'Не найдено' }, HttpStatus.NOT_FOUND);
    }

    return candidate;
  }

  @Patch(':id')
  async update(
    @Param('id', ValidateIdPipe) id: string,
    @Body() updateVisitedLessonDto: UpdateVisitedLessonDto,
  ) {
    const updated = await this.service.update(id, updateVisitedLessonDto);

    if (updated === null) {
      throw new HttpException({ message: 'Не найдено' }, HttpStatus.NOT_FOUND);
    }

    return updated;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
