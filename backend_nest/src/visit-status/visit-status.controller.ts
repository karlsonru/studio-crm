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
import { VisitStatusService } from './visit-status.service';
import { CreateVisitStatusDto } from './dto/create-visit-status.dto';
import { UpdateVisitStatusDto } from './dto/update-visit-status.dto';
import { ValidateIdPipe } from 'src/shared/validaitonPipe';

@Controller('visitstatus')
export class VisitStatusController {
  constructor(private readonly service: VisitStatusService) {}

  @Post()
  async create(@Body() createVisitStatusDto: CreateVisitStatusDto) {
    const created = await this.service.create(createVisitStatusDto);

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
    @Body() updateVisitStatusDto: UpdateVisitStatusDto,
  ) {
    const updated = await this.service.update(id, updateVisitStatusDto);

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
