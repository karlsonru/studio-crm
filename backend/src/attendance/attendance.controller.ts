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
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { ValidateIdPipe } from '../shared/validaitonPipe';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly service: AttendanceService) {}

  @Post()
  async create(@Body() createAttendanceDto: CreateAttendanceDto) {
    const created = await this.service.create(createAttendanceDto);

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
    @Body() updateAttendanceDto: UpdateAttendanceDto,
  ) {
    const updated = await this.service.update(id, updateAttendanceDto);

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
