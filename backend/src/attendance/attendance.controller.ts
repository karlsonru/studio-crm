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
  ParseIntPipe,
} from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import {
  UpdateAttendanceDto,
  UpdateAttendanceDtoSchemaAdapter,
  UpdatedVisitedStudent,
} from './dto/update-attendance.dto';
import {
  ValidateIdPipe,
  ValidateOptionalNumberPipe,
} from '../shared/validaitonPipe';
import { PaymentStatus, VisitStatus } from '../schemas/attendance.schema';
import { CreateAttendanceDtoSchemaAdapter } from './createAttendanceDtoSchemaAdapter';

@Controller('attendances')
export class AttendanceController {
  constructor(private readonly service: AttendanceService) {}

  @Post()
  async create(@Body() createAttendanceDto: CreateAttendanceDto) {
    const created = await this.service.create(
      new CreateAttendanceDtoSchemaAdapter(createAttendanceDto),
    );

    if (created === null) {
      throw new HttpException(
        { message: 'Уже существует' },
        HttpStatus.BAD_REQUEST,
      );
    }

    return created;
  }

  @Get()
  async findAll(
    @Query('filter') filter: string,
    @Query('lessonId') lessonId?: string,
    @Query('year', ValidateOptionalNumberPipe) year?: number,
    @Query('month', ValidateOptionalNumberPipe) month?: number,
    @Query('day', ValidateOptionalNumberPipe) day?: number,
    @Query('subscriptionId') subscriptionId?: string,
    @Query('dateFrom', ValidateOptionalNumberPipe) dateFrom?: number,
    @Query('dateTo', ValidateOptionalNumberPipe) dateTo?: number,
  ) {
    if (filter) {
      return await this.service.findAll(JSON.parse(filter));
    }

    const query: Record<
      string,
      string | number | Record<string, string | number>
    > = {};

    if (lessonId) {
      query['lesson'] = lessonId;
    }

    if (year && month && day) {
      query.date = Date.UTC(year, month - 1, day);
    }

    if (subscriptionId) {
      query['students.subscription'] = subscriptionId;
    }

    if (dateFrom) {
      query.date = { $gte: dateFrom };
    }

    if (dateTo) {
      query.date = { $lte: dateTo };
    }

    return await this.service.findAll(query);
  }

  @Get('/unpaid')
  async findAllUnpaid(@Query('days', ParseIntPipe) days: number) {
    const today = new Date();
    const searchDate = Date.UTC(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - days,
    );

    return await this.service.findAll({
      date: { $gte: searchDate, $lte: today.getTime() },
      students: {
        $elemMatch: {
          paymentStatus: PaymentStatus.UNPAID,
        },
      },
    });
  }

  @Get('/postponed')
  async findAllPostponed(@Query('days', ParseIntPipe) days: number) {
    const today = new Date();
    const searchDate = Date.UTC(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - days,
    );

    return await this.service.findAll({
      date: { $gte: searchDate, $lte: today.getTime() },
      students: {
        $elemMatch: {
          visitStatus: VisitStatus.POSTPONED_FUTURE,
        },
      },
    });
  }

  @Get(':id')
  async findOne(@Param('id', ValidateIdPipe) id: string) {
    const candidate = await this.service.findOne(id);

    if (candidate === null) {
      throw new HttpException({ message: 'Не найдено' }, HttpStatus.NOT_FOUND);
    }

    return candidate;
  }

  @Patch(':id/student/:studentId/:action')
  async updateAttendnceStudentById(
    @Param('id', ValidateIdPipe) id: string,
    @Param('studentId', ValidateIdPipe) studentId: string,
    @Param('action') action: 'add' | 'remove',
    @Body() updateAttendanceStudentDto: UpdatedVisitedStudent,
  ) {
    let updated = null;

    if (action === 'add') {
      updated = await this.service.addStudentToAttendance(
        id,
        studentId,
        updateAttendanceStudentDto,
      );
    }

    if (action === 'remove') {
      updated = await this.service.removeStudentFromAttendance(
        id,
        studentId,
        updateAttendanceStudentDto,
      );
    }

    if (updated === null) {
      throw new HttpException({ message: 'Не найдено' }, HttpStatus.NOT_FOUND);
    }

    return updated;
  }

  @Patch(':id')
  async update(
    @Param('id', ValidateIdPipe) id: string,
    @Body() updateAttendanceDto: UpdateAttendanceDto,
  ) {
    console.log('updateAttendanceDto');
    console.log(updateAttendanceDto);

    const updated = await this.service.update(
      id,
      new UpdateAttendanceDtoSchemaAdapter(updateAttendanceDto),
    );

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
