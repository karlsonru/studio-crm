import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { SubscriptionEntity } from './entities/subscription.entity';
import { SubscriptionModel, SubscriptionDocument } from '../schemas/';
import { IFilterQuery } from '../shared/IFilterQuery';

@Injectable()
export class SubscriptionService {
  private readonly populateQuery: Array<string>;

  constructor(
    @InjectModel(SubscriptionModel.name)
    private readonly subscriptionModel: Model<SubscriptionDocument>,
  ) {
    this.populateQuery = ['student', 'template', 'lesson'];
  }

  async create(createSubscriptionDto: CreateSubscriptionDto): Promise<SubscriptionEntity> {
    // можно ли как-то проверить на повтор? Как? Имя & дата начала & ID занятие && кол-во

    const created = await this.subscriptionModel.create(createSubscriptionDto);

    return created;
  }

  async findAll(query?: IFilterQuery<SubscriptionEntity>): Promise<Array<SubscriptionEntity>> {
    return await this.subscriptionModel.find(query ?? {}).populate(this.populateQuery);
  }

  async findOne(id: string): Promise<SubscriptionEntity | null> {
    return await this.subscriptionModel.findById(id).populate(this.populateQuery);
  }

  async update(
    id: string,
    updateSubscriptionDto: UpdateSubscriptionDto,
  ): Promise<SubscriptionEntity | null> {
    const updated = await this.subscriptionModel.findByIdAndUpdate(id, updateSubscriptionDto, {
      new: true,
    });

    return updated;
  }

  async remove(id: string) {
    await this.subscriptionModel.findByIdAndRemove(id);
    return;
  }
}
