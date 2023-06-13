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
  UseInterceptors,
} from '@nestjs/common';
import { LessonService } from './lesson.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { ValidateIdPipe } from '../shared/validaitonPipe';
import { LessonModel } from '../schemas';
import { MongooseClassSerializerInterceptor } from 'src/shared/mongooseClassSerializer.interceptor';
import { IFilterQuery } from 'src/shared/IFilterQuery';

@Controller('lesson')
@UseInterceptors(MongooseClassSerializerInterceptor(LessonModel))
export class LessonController {
  constructor(private readonly service: LessonService) {}

  @Post()
  async create(@Body() createLessonDto: CreateLessonDto) {
    console.log(createLessonDto);
    const created = await this.service.create(createLessonDto);

    if (created === null) {
      throw new HttpException({ message: 'Уже существует' }, HttpStatus.BAD_REQUEST);
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
    @Body() updateLessonDto: UpdateLessonDto | IFilterQuery<LessonModel>,
  ) {
    const updated = await this.service.update(id, updateLessonDto as UpdateLessonDto);

    if (updated === null) {
      throw new HttpException({ message: 'Не найдено' }, HttpStatus.NOT_FOUND);
    }

    return {
      message: 'success',
      payload: updated,
    };
  }

  @Delete(':id')
  async remove(@Param('id', ValidateIdPipe) id: string) {
    return await this.service.remove(id);
  }
}
