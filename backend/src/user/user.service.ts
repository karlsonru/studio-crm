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
    const candidate = await this.userModel.find({
      login: createUserDto.login,
    });

    if (candidate.length) {
      return null;
    }

    const hash = createHash('sha-256');
    const passHash = hash.update(createUserDto.password);

    const newUser = await this.userModel.create({
      ...createUserDto,
      password: passHash,
      birthday: createUserDto.birthday,
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
