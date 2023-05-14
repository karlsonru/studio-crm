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
} from '@nestjs/common';
import { StudentService } from './student.service';
import { ValidateIdPipe } from 'src/shared/validaitonPipe';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Controller('student')
export class StudentController {
  constructor(private readonly service: StudentService) {}

  @Post()
  async create(@Body() createStudentDto: CreateStudentDto) {
    const created = await this.service.create(createStudentDto);

    if (created === null) {
      throw new HttpException({ message: 'Уже существует' }, HttpStatus.BAD_REQUEST);
    }

    return {
      message: 'success',
      payload: created,
    };
  }

  @Get()
  async findAll() {
    throw new Error('Моя ошибка');
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
    @Body() updateStudentDto: UpdateStudentDto,
  ) {
    const updated = await this.service.update(id, updateStudentDto);

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
