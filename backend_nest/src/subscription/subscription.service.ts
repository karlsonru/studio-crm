import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { SubscriptionEntity } from './entities/subscription.entity';
import {
  Subscription,
  SubscriptionDocument,
} from '../schemas/subscription.schema';
import { IFilterQuery } from '../shared/IFilterQuery';

@Injectable()
export class SubscriptionService {
  private readonly populateQuery: Array<string>;

  constructor(
    @InjectModel(Subscription.name)
    private readonly model: Model<SubscriptionDocument>,
  ) {
    this.populateQuery = ['student', 'template', 'lesson'];
  }

  async create(
    createSubscriptionDto: CreateSubscriptionDto,
  ): Promise<SubscriptionEntity> {
    // можно ли как-то проверить на повтор? Как? Имя & дата начала & ID занятие && кол-во

    const created = await this.model.create(createSubscriptionDto);

    return created;
  }

  async findAll(
    query?: IFilterQuery<SubscriptionEntity>,
  ): Promise<Array<SubscriptionEntity>> {
    return await this.model.find(query ?? {}).populate(this.populateQuery);
  }

  async findOne(id: string): Promise<SubscriptionEntity | null> {
    return await this.model.findById(id).populate(this.populateQuery);
  }

  async update(
    id: string,
    updateSubscriptionDto: UpdateSubscriptionDto,
  ): Promise<SubscriptionEntity | null> {
    const updated = await this.model.findByIdAndUpdate(
      id,
      updateSubscriptionDto,
      {
        new: true,
      },
    );

    return updated;
  }

  async remove(id: string) {
    await this.model.findByIdAndRemove(id);
    return;
  }
}
