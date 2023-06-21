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
  HttpCode,
} from '@nestjs/common';
import { LessonService, action } from './lesson.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { ValidateIdPipe } from '../shared/validaitonPipe';
import { LessonModel } from '../schemas';
import { MongooseClassSerializerInterceptor } from 'src/shared/mongooseClassSerializer.interceptor';

@Controller('lesson')
@UseInterceptors(MongooseClassSerializerInterceptor(LessonModel))
export class LessonController {
  constructor(private readonly service: LessonService) {}

  @Post()
  async create(@Body() createLessonDto: CreateLessonDto) {
    console.log('Create lesson dto');
    console.log(createLessonDto);
    const created = await this.service.create(createLessonDto);

    if (created === null) {
      throw new HttpException({ message: 'Уже существует' }, HttpStatus.BAD_REQUEST);
    }

    return created;
  }

  @Get()
  async findAll(@Query('filter') filter?: string) {
    if (filter) {
      const query = JSON.parse(filter);

      return await this.service.findAll(query);
    }

    return await this.service.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ValidateIdPipe) id: string) {
    const lesson = await this.service.findOne(id);

    if (lesson === null) {
      throw new HttpException({ message: 'Не найдено' }, HttpStatus.NOT_FOUND);
    }

    return lesson;
  }

  @Patch(':id/students/:action')
  async updateStudents(
    @Param('id', ValidateIdPipe) id: string,
    @Param('action') action: action,
    @Body() updateLessonDto: UpdateLessonDto,
  ) {
    const updated = await this.service.updateStudents(id, updateLessonDto, action);

    if (updated === null) {
      throw new HttpException({ message: 'Не найдено' }, HttpStatus.NOT_FOUND);
    }

    return updated;
  }

  @Patch(':id')
  async update(@Param('id', ValidateIdPipe) id: string, @Body() updateLessonDto: UpdateLessonDto) {
    const updated = await this.service.update(id, updateLessonDto as UpdateLessonDto);

    if (updated === null) {
      throw new HttpException({ message: 'Не найдено' }, HttpStatus.NOT_FOUND);
    }

    return updated;
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id', ValidateIdPipe) id: string) {
    const deleted = await this.service.remove(id);

    if (!deleted) {
      throw new HttpException({ message: 'Не найдено' }, HttpStatus.NOT_FOUND);
    }
  }
}
