import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleModel, RoleDocument } from '../schemas';

@Injectable()
export class RoleService {
  constructor(
    @InjectModel(RoleModel.name)
    private readonly roleModel: Model<RoleDocument>,
  ) {}

  async create(createRoleDto: CreateRoleDto) {
    const candiate = await this.roleModel.find({
      value: createRoleDto.value,
    });

    if (candiate.length) {
      return null;
    }

    return await this.roleModel.create(createRoleDto);
  }

  async findAll() {
    return `This action returns all role`;
  }

  findOne(id: number) {
    return `This action returns a #${id} role`;
  }

  update(id: number, updateRoleDto: UpdateRoleDto) {
    return `This action updates a #${id} role`;
  }

  remove(id: number) {
    return `This action removes a #${id} role`;
  }
}
