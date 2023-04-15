import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { ValidateIdPipe } from '../shared/validaitonPipe';

@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly service: SubscriptionService) {}

  @Post()
  async create(@Body() createSubscriptionDto: CreateSubscriptionDto) {
    const created = await this.service.create(createSubscriptionDto);

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
    @Body() updateSubscriptionDto: UpdateSubscriptionDto,
  ) {
    const updated = await this.service.update(id, updateSubscriptionDto);

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
