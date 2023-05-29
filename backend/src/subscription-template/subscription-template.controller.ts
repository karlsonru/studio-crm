import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpCode,
  UseInterceptors,
} from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums';
import { SubscriptionTemplateService } from './subscription-template.service';
import { CreateSubscriptionTemplateDto } from './dto/create-subscription-template.dto';
import { UpdateSubscriptionTemplateDto } from './dto/update-subscription-template.dto';
import { ValidateIdPipe } from '../shared/validaitonPipe';
import { MongooseClassSerializerInterceptor } from '../shared/mongooseClassSerializer.interceptor';
import { SubscriptionTemplateModel } from '../schemas';

@Controller('subscription-templates')
@UseInterceptors(MongooseClassSerializerInterceptor(SubscriptionTemplateModel))
export class SubscriptionTemplateController {
  constructor(private readonly service: SubscriptionTemplateService) {}

  @Post()
  async create(@Body() createSubscriptionTemplateDto: CreateSubscriptionTemplateDto) {
    const created = await this.service.create(createSubscriptionTemplateDto);

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
    @Body() updateSubscriptionTemplateDto: UpdateSubscriptionTemplateDto,
  ) {
    const updated = await this.service.update(id, updateSubscriptionTemplateDto);

    if (updated === null) {
      throw new HttpException({ message: 'Не найдено' }, HttpStatus.NOT_FOUND);
    }

    return {
      message: 'success',
      payload: updated,
    };
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id', ValidateIdPipe) id: string) {
    return await this.service.remove(id);
  }
}
