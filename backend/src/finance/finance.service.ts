import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PopulateOptions } from 'mongoose';
import { CreateFinanceDto } from './dto/create-finance.dto';
import { UpdateFinanceDto } from './dto/update-finance.dto';
import { FinanceDocument, FinanceModel } from '../schemas';
import { IFilterQuery } from '../shared/IFilterQuery';
import { logger } from '../shared/logger.middleware';
import { isMongoId } from 'class-validator';

@Injectable()
export class FinanceService {
  private readonly populateQuery: Array<PopulateOptions>;

  constructor(
    @InjectModel(FinanceModel.name)
    private readonly financeModel: Model<FinanceDocument>,
  ) {
    this.populateQuery = [{ path: 'location', select: '_id title' }];
  }

  async create(createFinanceDto: CreateFinanceDto) {
    const record = await this.financeModel.create(createFinanceDto);

    logger.info(
      `Финансы. Добавлена запись ${createFinanceDto.title} на сумму ${createFinanceDto.amount}
       за дату ${new Date(createFinanceDto.date).toLocaleDateString('ru-RU')}}`,
    );

    return record;
  }

  async findAll(query?: IFilterQuery<FinanceModel>) {
    if (query?.location && !isMongoId(query.location)) {
      delete query.location;
    }

    return await this.financeModel.find(query ?? {}).populate(this.populateQuery);
  }

  async findOne(query: IFilterQuery<FinanceModel>) {
    return await this.financeModel.findOne(query).populate(this.populateQuery);
  }

  async update(id: string, updateFinanceDto: UpdateFinanceDto) {
    const updated = await this.financeModel.findByIdAndUpdate(id, updateFinanceDto, { new: true });

    logger.info(`Финансы. Обновлена запись ${updated?.title} с ID: ${updated?._id}`);

    return updated;
  }

  async remove(id: string) {
    const deleted = await this.financeModel.findByIdAndDelete(id);
    logger.info(`Финансы. Удалена запись ${deleted?.title} с ID: ${deleted?._id}`);
    return deleted;
  }
}
