import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { LocationModel, LocationDocument } from '../schemas/location.schema';
import { LocationEntity } from './entities/location.entity';

@Injectable()
export class LocationService {
  constructor(
    @InjectModel(LocationModel.name)
    private readonly locationModel: Model<LocationDocument>,
  ) {}

  async create(createLocationDto: CreateLocationDto): Promise<LocationEntity | null> {
    const candidate = await this.locationModel.find({
      $or: [
        {
          title: {
            $regex: createLocationDto.title,
            $options: 'i',
          },
        },
        {
          address: {
            $regex: createLocationDto.address,
            $options: 'i',
          },
        },
      ],
    });

    if (candidate.length) {
      return null;
    }

    return await this.locationModel.create(createLocationDto);
  }

  async findAll(): Promise<Array<LocationEntity>> {
    return await this.locationModel.find({});
  }

  async findOne(id: string): Promise<LocationEntity | null> {
    return await this.locationModel.findById(id);
  }

  async update(id: string, updateLocationDto: UpdateLocationDto): Promise<LocationEntity | null> {
    const updated = await this.locationModel.findOneAndUpdate(
      id as unknown as Types.ObjectId,
      updateLocationDto,
      {
        new: true,
      },
    );

    return updated;
  }

  async remove(id: string) {
    return await this.locationModel.findByIdAndDelete(id);
  }
}
