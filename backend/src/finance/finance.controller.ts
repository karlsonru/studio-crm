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
import { CreateFinanceDto, CreateFinanceCategoryDto } from './dto/create-finance.dto';
import { UpdateFinanceDto } from './dto/update-finance.dto';
import { ValidateIdPipe } from '../shared/validaitonPipe';
import { isMongoId } from 'class-validator';

@Controller('finance')
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  @Get('/categories')
  async findAllCategories() {
    return await this.financeService.findAllCategories();
  }

  @Post('/categories')
  async createCategory(@Body() createFinanceCategoryDto: CreateFinanceCategoryDto) {
    const created = await this.financeService.createCategory(createFinanceCategoryDto);

    return created;
  }

  @HttpCode(204)
  @Delete('/categories/:id')
  async removeCategory(@Param('id', ValidateIdPipe) id: string) {
    const deleted = await this.financeService.removeCategory(id);

    if (!deleted) {
      throw new HttpException({ message: 'Не найдено' }, HttpStatus.NOT_FOUND);
    }
  }

  @Post()
  async create(@Body() createFinanceDto: CreateFinanceDto) {
    // если передан общий тип, то не добавляем его как локацию
    if (!isMongoId(createFinanceDto.location)) {
      delete createFinanceDto.location;
    }

    const created = await this.financeService.create(createFinanceDto);

    return created;
  }

  @Get()
  async findAll(
    @Query('filter') filter?: string,
    @Query('locationId') locationId?: string,
    @Query('month') month?: number,
  ) {
    const query = filter ? JSON.parse(filter) : {};

    if (month) {
      const year = new Date().getFullYear();
      query.date = { $gte: Date.UTC(year, month, 1), $lte: Date.UTC(year, month + 1, 1) };
    }

    return await this.financeService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id', ValidateIdPipe) id: string) {
    const record = await this.financeService.findOne({ id });

    if (!record) {
      throw new HttpException({ message: 'Не найдено' }, HttpStatus.NOT_FOUND);
    }

    return record;
  }

  @Patch(':id')
  async update(
    @Param('id', ValidateIdPipe) id: string,
    @Body() updateFinanceDto: UpdateFinanceDto,
  ) {
    // если передан общий тип, то не добавляем его как локацию
    if (!isMongoId(updateFinanceDto.location)) {
      delete updateFinanceDto.location;
    }

    const updated = await this.financeService.update(id, updateFinanceDto);

    if (!updated) {
      throw new HttpException({ message: 'Не найдено' }, HttpStatus.NOT_FOUND);
    }

    return updated;
  }

  @HttpCode(204)
  @Delete(':id')
  async remove(@Param('id', ValidateIdPipe) id: string) {
    const deleted = await this.financeService.remove(id);

    if (!deleted) {
      throw new HttpException({ message: 'Не найдено' }, HttpStatus.NOT_FOUND);
    }
  }
}
