import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { createHash } from 'crypto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserModel, UserDocument } from '../schemas';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserModel.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserModel | null> {
    const candidatQuery = createUserDto.login
      ? { $or: [{ login: createUserDto.login }, { fullname: createUserDto.fullname }] }
      : { fullname: createUserDto.fullname };

    const candidate = await this.userModel.find(candidatQuery);

    if (candidate.length) {
      return null;
    }

    if (createUserDto.password) {
      const hash = createHash('sha-256');
      const passHash = hash.update(createUserDto.password);
      createUserDto.password = passHash.digest('hex');
    }

    const newUser = await this.userModel.create({
      ...createUserDto,
      isActive: true,
    });

    return newUser;
  }

  async findAll(): Promise<Array<UserModel>> {
    return await this.userModel.find({});
  }

  async findOne(id: string): Promise<UserModel | null> {
    return await this.userModel.findById(id);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserModel | null> {
    const updated = await this.userModel.findByIdAndUpdate(id, updateUserDto, {
      new: true,
    });

    return updated;
  }

  async remove(id: string) {
    await this.userModel.findByIdAndRemove(id);
    return;
  }
}
