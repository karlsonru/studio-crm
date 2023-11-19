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
  HttpCode,
} from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { ValidateIdPipe } from '../shared/validaitonPipe';

/** 
TODO: перенести логику списания абонемента в контроллер. 
AttendanceService отвечает за создание занятие 
SubscriptionCharge (AttendanceCharge, AttendancePaymentService ?) отвечает за списание абонементов по посещению

Транзакция --> 

То есть:
- поиск абонементов подходящих для занятия   
- добавление абонемента к студенту
- списание занятия с абонемента
- добавление статуса оплаты студента
- удаление студента из lesson в случае если занятие однократное

<-- 

*/

@Controller('attendances')
export class AttendanceController {
  constructor(private readonly service: AttendanceService) {}

  @Post()
  async create(@Body() createAttendanceDto: CreateAttendanceDto) {
    // время занятия сохраняем в UTC
    const timestamp = Date.UTC(
      createAttendanceDto.year,
      createAttendanceDto.month - 1,
      createAttendanceDto.day,
    );

    const created = await this.service.create({
      ...createAttendanceDto,
      date: timestamp,
      day: createAttendanceDto.weekday,
    });

    if (created === null) {
      throw new HttpException({ message: 'Уже существует' }, HttpStatus.BAD_REQUEST);
    }

    return created;
  }

  @Get()
  async findAll(
    @Query('filter') filter: string,
    @Param('year') year?: number,
    @Param('month') month?: number,
    @Param('day') day?: number,
  ) {
    const parsedQuery = JSON.parse(filter);

    // если в запросе переаны параметры даты, то узнаём UTC timestamp занятия и добавляем его к запросу
    if (year && month && day) {
      parsedQuery.date = Date.UTC(year, month, day);
    }

    return await this.service.findAll(parsedQuery);
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
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
