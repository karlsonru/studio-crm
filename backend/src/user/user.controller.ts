import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  UseInterceptors,
  HttpCode,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ValidateIdPipe } from '../shared/validaitonPipe';
import { MongooseClassSerializerInterceptor } from '../shared/mongooseClassSerializer.interceptor';
import { UserModel } from '../schemas';

@Controller('user')
@UseInterceptors(MongooseClassSerializerInterceptor(UserModel))
export class UserController {
  constructor(private readonly service: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const created = await this.service.create(createUserDto);

    if (created === null) {
      throw new HttpException({ message: 'Уже существует' }, HttpStatus.BAD_REQUEST);
    }

    return created;
  }

  @Get()
  async findAll() {
    return await this.service.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ValidateIdPipe) id: string) {
    const candidate = await this.service.findOne({ _id: id });

    if (candidate === null) {
      throw new HttpException({ message: 'Не найдено' }, HttpStatus.NOT_FOUND);
    }

    return candidate;
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const updated = await this.service.update(id, updateUserDto);

    if (updated === null) {
      throw new HttpException({ message: 'Не найдено' }, HttpStatus.NOT_FOUND);
    }

    return updated;
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id', ValidateIdPipe) id: string) {
    return await this.service.remove(id);
  }
}
