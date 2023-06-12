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
  HttpCode,
} from '@nestjs/common';
import { FinanceService } from './finance.service';
import { CreateFinanceDto } from './dto/create-finance.dto';
import { UpdateFinanceDto } from './dto/update-finance.dto';
import { ValidateIdPipe } from '../shared/validaitonPipe';

@Controller('finance')
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  @Post()
  async create(@Body() createFinanceDto: CreateFinanceDto) {
    const created = await this.financeService.create(createFinanceDto);

    return {
      message: 'success',
      paylod: created,
    };
  }

  @Get()
  async findAll(@Query('filter') filter?: string) {
    const query = filter ? JSON.parse(filter) : {};

    return {
      message: 'success',
      payload: await this.financeService.findAll(query),
    };
  }

  @Get(':id')
  async findOne(@Param('id', ValidateIdPipe) id: string) {
    const record = await this.financeService.findOne({ id });

    if (!record) {
      throw new HttpException({ message: 'Не найдено' }, HttpStatus.NOT_FOUND);
    }

    return {
      message: 'success',
      payload: record,
    };
  }

  @Patch(':id')
  async update(
    @Param('id', ValidateIdPipe) id: string,
    @Body() updateFinanceDto: UpdateFinanceDto,
  ) {
    const updated = await this.financeService.update(id, updateFinanceDto);

    if (!updated) {
      throw new HttpException({ message: 'Не найдено' }, HttpStatus.NOT_FOUND);
    }

    return {
      message: 'success',
      payload: updated,
    };
  }

  @HttpCode(204)
  @Delete(':id')
  async remove(@Param('id', ValidateIdPipe) id: string) {
    await this.financeService.remove(id);
  }
}
