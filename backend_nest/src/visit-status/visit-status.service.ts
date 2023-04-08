import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateVisitStatusDto } from './dto/create-visit-status.dto';
import { UpdateVisitStatusDto } from './dto/update-visit-status.dto';
import { VisitStatusEntity } from './entities/visit-status.entity';
import {
  VisitStatus,
  VisitStatusDocument,
} from '../schemas/visitStatus.schema';
import { IFilterQuery } from '../shared/IFilterQuery';

@Injectable()
export class VisitStatusService {
  constructor(
    @InjectModel(VisitStatus.name)
    private readonly model: Model<VisitStatusDocument>,
  ) {}

  async create(
    createVisitStatusDto: CreateVisitStatusDto,
  ): Promise<VisitStatusEntity | null> {
    const candidate = await this.model.findOne({
      title: createVisitStatusDto.action,
    });

    if (candidate) {
      return null;
    }

    const created = await this.model.create(createVisitStatusDto);

    return created;
  }

  async findAll(
    query?: IFilterQuery<VisitStatusEntity>,
  ): Promise<Array<VisitStatusEntity>> {
    return await this.model.find(query ?? {});
  }

  async findOne(id: string): Promise<VisitStatusEntity | null> {
    return await this.model.findById(id);
  }

  async update(
    id: string,
    updateVisitStatusDto: UpdateVisitStatusDto,
  ): Promise<VisitStatusEntity | null> {
    const updated = await this.model.findByIdAndUpdate(
      id,
      updateVisitStatusDto,
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
