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
import { ValidateIdPipe } from 'src/shared/validaitonPipe';

@Controller('visited-lesson')
export class VisitedLessonController {
  constructor(private readonly service: VisitedLessonService) {}

  @Post()
  async create(@Body() createVisitedLessonDto: CreateVisitedLessonDto) {
    const created = await this.service.create(createVisitedLessonDto);

    if (created === null) {
      throw new HttpException(
        { message: 'Уже существует' },
        HttpStatus.BAD_REQUEST,
      );
    }

    return {
      message: 'success',
      payload: created,
    };
  }

  @Get()
  async findAll(@Query('filter') filter?: string) {
    if (filter) {
      const query = JSON.parse(filter);

      return {
        message: 'success',
        payload: await this.service.findAll(query),
      };
    }

    return {
      message: 'success',
      payload: await this.service.findAll(),
    };
  }

  @Get(':id')
  async findOne(@Param('id', ValidateIdPipe) id: string) {
    const candidate = await this.service.findOne(id);

    if (candidate === null) {
      throw new HttpException({ message: 'Не найдено' }, HttpStatus.NOT_FOUND);
    }

    return {
      message: 'success',
      payload: candidate,
    };
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

    return {
      message: 'success',
      payload: updated,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
