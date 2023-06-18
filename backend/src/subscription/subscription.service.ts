import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryOptions, mongo } from 'mongoose';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { SubscriptionModel, SubscriptionDocument } from '../schemas';
import { IFilterQuery } from '../shared/IFilterQuery';

@Injectable()
export class SubscriptionService {
  private readonly populateQuery: Array<string>;

  constructor(
    @InjectModel(SubscriptionModel.name)
    private readonly subscriptionModel: Model<SubscriptionDocument>,
  ) {
    this.populateQuery = ['student', 'lessons'];
  }

  async create(createSubscriptionDto: CreateSubscriptionDto): Promise<SubscriptionModel> {
    // можно ли как-то проверить на повтор? Как? Имя & дата начала & ID занятие && кол-во
    const created = await this.subscriptionModel.create(createSubscriptionDto);

    return created;
  }

  async findAll(
    query?: IFilterQuery<SubscriptionModel>,
    options?: QueryOptions,
  ): Promise<Array<SubscriptionModel>> {
    return await this.subscriptionModel
      .find(query ?? {}, null, options)
      .populate(this.populateQuery);
  }

  async findOne(id: string): Promise<SubscriptionModel | null> {
    return await this.subscriptionModel.findById(id).populate(this.populateQuery);
  }

  async update(
    id: string,
    updateSubscriptionDto: UpdateSubscriptionDto,
  ): Promise<SubscriptionModel | null> {
    const updated = await this.subscriptionModel.findByIdAndUpdate(id, updateSubscriptionDto, {
      new: true,
    });

    return updated;
  }

  async updateMany(
    ids: IFilterQuery<SubscriptionModel>,
    update: IFilterQuery<SubscriptionModel>,
  ): Promise<mongo.UpdateResult> {
    const updated = await this.subscriptionModel.updateMany(ids, update);
    return updated;
  }

  async remove(id: string) {
    await this.subscriptionModel.findByIdAndRemove(id);
    return;
  }
}
