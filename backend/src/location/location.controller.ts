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
} from '@nestjs/common';
import { LocationService } from './location.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { ValidateIdPipe } from '../shared/validaitonPipe';
import { LocationModel } from '../schemas';
import { MongooseClassSerializerInterceptor } from '../shared/mongooseClassSerializer.interceptor';

@Controller('location')
@UseInterceptors(MongooseClassSerializerInterceptor(LocationModel))
export class LocationController {
  constructor(private readonly service: LocationService) {}

  @Post()
  async create(@Body() createLocationDto: CreateLocationDto) {
    const created = await this.service.create(createLocationDto);

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
    @Body() updateLocationDto: UpdateLocationDto,
  ) {
    const updated = await this.service.update(id, updateLocationDto);

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
