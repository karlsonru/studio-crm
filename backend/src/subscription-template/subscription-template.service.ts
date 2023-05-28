import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateSubscriptionTemplateDto } from './dto/create-subscription-template.dto';
import { UpdateSubscriptionTemplateDto } from './dto/update-subscription-template.dto';
import { SubscriptionTemplateModel, SubscriptionTemplateDocument } from '../schemas';

@Injectable()
export class SubscriptionTemplateService {
  constructor(
    @InjectModel(SubscriptionTemplateModel.name)
    private readonly subscriptionTemplateModel: Model<SubscriptionTemplateDocument>,
  ) {}
  async create(
    createSubscriptionTemplateDto: CreateSubscriptionTemplateDto,
  ): Promise<SubscriptionTemplateModel | null> {
    const candidate = await this.subscriptionTemplateModel.findOne({
      title: {
        $regex: createSubscriptionTemplateDto.title,
        $options: 'i',
      },
    });

    if (candidate) {
      return null;
    }

    return await this.subscriptionTemplateModel.create(createSubscriptionTemplateDto);
  }

  async findAll(): Promise<Array<SubscriptionTemplateModel>> {
    return await this.subscriptionTemplateModel.find({});
  }

  async findOne(id: string): Promise<SubscriptionTemplateModel | null> {
    return await this.subscriptionTemplateModel.findById(id);
  }

  async update(
    id: string,
    updateSubscriptionTemplateDto: UpdateSubscriptionTemplateDto,
  ): Promise<SubscriptionTemplateModel | null> {
    const updated = await this.subscriptionTemplateModel.findByIdAndUpdate(
      id,
      updateSubscriptionTemplateDto,
      {
        new: true,
      },
    );

    return updated;
  }

  async remove(id: string) {
    return await this.subscriptionTemplateModel.findByIdAndRemove(id);
  }
}
