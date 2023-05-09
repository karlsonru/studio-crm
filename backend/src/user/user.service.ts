import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { createHash } from 'crypto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { UserModel, UserDocument } from '../schemas';
import { RoleModel, RoleDocument } from '../schemas';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserModel.name)
    private readonly userModel: Model<UserDocument>,
    @InjectModel(RoleModel.name)
    private readonly roleModel: Model<RoleDocument>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserEntity | null> {
    const candidate = await this.userModel.find({
      login: createUserDto.login,
    });

    if (candidate.length) {
      return null;
    }

    const role = await this.roleModel.findOne({ value: createUserDto.role });

    if (role === null) {
      return null;
    }

    const hash = createHash('sha-256');
    const passHash = hash.update(createUserDto.password);

    const newUser = await this.userModel.create({
      ...createUserDto,
      password: passHash,
      birthday: createUserDto.birthday,
      role: role.id,
      isActive: true,
    });

    return newUser;
  }

  async findAll(): Promise<Array<UserEntity>> {
    return await this.userModel.find({});
  }

  async findOne(id: string): Promise<UserEntity | null> {
    return await this.userModel.findById(id);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserEntity | null> {
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
