import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  SubscriptionTemplateModel,
  SubscriptionTemplateDocument,
} from '../schemas/subscriptionTemplate.schema';
import { CreateSubscriptionTemplateDto } from './dto/create-subscription-template.dto';
import { UpdateSubscriptionTemplateDto } from './dto/update-subscription-template.dto';
import { SubscriptionTemplateEntity } from './entities/subscription-template.entity';

@Injectable()
export class SubscriptionTemplateService {
  constructor(
    @InjectModel(SubscriptionTemplateModel.name)
    private readonly subscriptionTemplateModel: Model<SubscriptionTemplateDocument>,
  ) {}
  async create(
    createSubscriptionTemplateDto: CreateSubscriptionTemplateDto,
  ): Promise<SubscriptionTemplateEntity | null> {
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

  async findAll(): Promise<Array<SubscriptionTemplateEntity>> {
    return await this.subscriptionTemplateModel.find({});
  }

  async findOne(id: string): Promise<SubscriptionTemplateEntity | null> {
    return await this.subscriptionTemplateModel.findById(id);
  }

  async update(
    id: string,
    updateSubscriptionTemplateDto: UpdateSubscriptionTemplateDto,
  ): Promise<SubscriptionTemplateEntity | null> {
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
