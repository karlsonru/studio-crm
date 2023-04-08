import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { createHash } from 'crypto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from '../schemas/user.schema';
import { UserEntity } from './entities/user.entity';
import { Role, RoleDocument } from '../schemas/role.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly model: Model<UserDocument>,
    @InjectModel(Role.name)
    private readonly roleModel: Model<RoleDocument>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserEntity | null> {
    const candidate = await this.model.find({
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

    const newUser = await this.model.create({
      ...createUserDto,
      password: passHash,
      birthday: createUserDto.birthday,
      role: role.id,
      isActive: true,
    });

    return newUser;
  }

  async findAll(): Promise<Array<UserEntity>> {
    return await this.model.find({});
  }

  async findOne(id: string): Promise<UserEntity | null> {
    return await this.model.findById(id);
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserEntity | null> {
    const updated = await this.model.findByIdAndUpdate(id, updateUserDto, {
      new: true,
    });

    return updated;
  }

  async remove(id: string) {
    await this.model.findByIdAndRemove(id);
    return;
  }
}
