import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateVisitStatusDto } from './dto/create-visit-status.dto';
import { UpdateVisitStatusDto } from './dto/update-visit-status.dto';
import { VisitStatusEntity } from './entities/visit-status.entity';
import { VisitStatusModel, VisitStatusDocument } from '../schemas';
import { IFilterQuery } from '../shared/IFilterQuery';

@Injectable()
export class VisitStatusService {
  constructor(
    @InjectModel(VisitStatusModel.name)
    private readonly visitStatusModel: Model<VisitStatusDocument>,
  ) {}

  async create(createVisitStatusDto: CreateVisitStatusDto): Promise<VisitStatusEntity | null> {
    const candidate = await this.visitStatusModel.findOne({
      title: createVisitStatusDto.action,
    });

    if (candidate) {
      return null;
    }

    const created = await this.visitStatusModel.create(createVisitStatusDto);

    return created;
  }

  async findAll(query?: IFilterQuery<VisitStatusEntity>): Promise<Array<VisitStatusEntity>> {
    return await this.visitStatusModel.find(query ?? {});
  }

  async findOne(id: string): Promise<VisitStatusEntity | null> {
    return await this.visitStatusModel.findById(id);
  }

  async update(
    id: string,
    updateVisitStatusDto: UpdateVisitStatusDto,
  ): Promise<VisitStatusEntity | null> {
    const updated = await this.visitStatusModel.findByIdAndUpdate(id, updateVisitStatusDto, {
      new: true,
    });

    return updated;
  }

  async remove(id: string) {
    await this.visitStatusModel.findByIdAndRemove(id);
    return;
  }
}
