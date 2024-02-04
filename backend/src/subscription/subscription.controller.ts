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
  UseInterceptors,
  HttpCode,
} from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { ValidateIdPipe } from '../shared/validaitonPipe';
import { SubscriptionModel } from '../schemas';
import { MongooseClassSerializerInterceptor } from '../shared/mongooseClassSerializer.interceptor';

@Controller('subscription')
@UseInterceptors(MongooseClassSerializerInterceptor(SubscriptionModel))
export class SubscriptionController {
  constructor(private readonly service: SubscriptionService) {}

  @Post()
  async create(@Body() createSubscriptionDto: CreateSubscriptionDto) {
    const created = await this.service.create(createSubscriptionDto);

    if (created === null) {
      throw new HttpException({ message: 'Уже существует' }, HttpStatus.BAD_REQUEST);
    }

    return created;
  }

  @Get()
  async findAll(@Query('filter') filter?: string) {
    console.log('Filter: ' + filter);
    return await this.service.findAll(filter ? JSON.parse(filter) : {});
  }

  @Get(':id')
  async findOne(@Param('id', ValidateIdPipe) id: string) {
    const candidate = await this.service.findOneById(id);

    if (candidate === null) {
      throw new HttpException({ message: 'Не найдено' }, HttpStatus.NOT_FOUND);
    }

    return candidate;
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

    return updated;
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
