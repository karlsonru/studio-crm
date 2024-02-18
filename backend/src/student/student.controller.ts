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
  UseInterceptors,
  Query,
  HttpCode,
  ParseIntPipe,
} from '@nestjs/common';
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { ValidateIdPipe } from '../shared/validaitonPipe';
import { StudentModel } from '../schemas';
import { MongooseClassSerializerInterceptor } from '../shared/mongooseClassSerializer.interceptor';

@Controller('student')
@UseInterceptors(MongooseClassSerializerInterceptor(StudentModel))
export class StudentController {
  constructor(private readonly service: StudentService) {}

  @Post()
  async create(@Body() createStudentDto: CreateStudentDto) {
    const created = await this.service.create(createStudentDto);

    if (created === null) {
      throw new HttpException({ message: 'Уже существует' }, HttpStatus.BAD_REQUEST);
    }

    return created;
  }

  @Get('/closest-birthdays')
  async findStudentsWithClosestBirthday(@Query('days', ParseIntPipe) days: number) {
    const birthdayMaxPossible = new Date();
    birthdayMaxPossible.setDate(birthdayMaxPossible.getDate() + days);
    birthdayMaxPossible.setFullYear(1970);

    const birthdayMinPossible = new Date();
    birthdayMinPossible.setDate(birthdayMinPossible.getDate() - days);
    birthdayMinPossible.setFullYear(1970);

    const students = await this.service.findAll({});

    return students.filter((student) => {
      const birthday = new Date(student.birthday);
      birthday.setFullYear(1970);

      const condtion = birthday >= birthdayMinPossible && birthday <= birthdayMaxPossible;

      return condtion;
    });
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
    @Body() updateStudentDto: UpdateStudentDto,
  ) {
    const updated = await this.service.update(id, updateStudentDto);

    if (updated === null) {
      throw new HttpException({ message: 'Не найдено' }, HttpStatus.NOT_FOUND);
    }

    return updated;
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id', ValidateIdPipe) id: string) {
    return await this.service.remove(id);
  }
}
