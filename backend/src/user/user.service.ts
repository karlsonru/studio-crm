import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserModel, UserDocument } from '../schemas';
import { logger } from '../shared/logger.middleware';
import { IFilterQuery } from 'src/shared/IFilterQuery';

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
      logger.debug(
        `При создании нового пользователя повтор логина ${createUserDto.login} или имени ${createUserDto.fullname}`,
      );
      return null;
    }

    if (createUserDto.password) {
      createUserDto.password = await bcrypt.hash(createUserDto.password, 10);
    }

    const newUser = await this.userModel.create({
      ...createUserDto,
      isActive: true,
    });

    logger.info(
      `Создан новый пользователь ${createUserDto.fullname}. Возможность авторизации: ${createUserDto.canAuth}`,
    );

    return newUser;
  }

  async findAll(query?: IFilterQuery<UserModel>): Promise<Array<UserModel>> {
    return await this.userModel.find(query ?? {});
  }

  async findOne(query: IFilterQuery<UserModel>): Promise<UserModel | null> {
    return await this.userModel.findOne(query);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserModel | null> {
    logger.info(
      `Обновление пользователя ${updateUserDto.fullname}. Авторизация: ${updateUserDto.canAuth}. ID: ${id}`,
    );

    const user = await this.findOne({ _id: id });

    if (!user) {
      logger.debug(`Пользователь для обновления не найден. ID: ${id}`);
      return null;
    }

    // тем, кому запрещено входить - при обновлении всегда пароль и логин установим в null
    if (!updateUserDto.canAuth) {
      const updated = await this.userModel.findByIdAndUpdate(
        id,
        { ...updateUserDto, login: null, password: null },
        { new: true },
      );

      return updated;
    }

    // если можно входить и передан новый пароль - обновим только после сравнения со старым (если он есть)
    if (updateUserDto.canAuth && updateUserDto.newPassword) {
      if (!updateUserDto.password) {
        logger.debug(
          `Не передан пароль для обновления пользователя ${updateUserDto.fullname}. ID: ${id}`,
        );
        return null;
      }

      // если у пользователя уже установлен пароль - проверяем его на валидность
      if (user.password) {
        const isValidPassword = await bcrypt.compare(updateUserDto.password, user.password);

        if (!isValidPassword) {
          logger.debug(
            `Пользователь ${updateUserDto.fullname}. Старый и новый пароль не совпадают. Отказано в обновлении. ID: ${id}`,
          );
          return null;
        }
      }

      const newPassword = await bcrypt.hash(updateUserDto.newPassword, 10);

      logger.info(`Пользователь ${updateUserDto.fullname}. Установлен новый пароль. ID: ${id}`);

      const updated = await this.userModel.findByIdAndUpdate(
        id,
        { ...updateUserDto, password: newPassword },
        { new: true },
      );

      return updated;
    }

    // в остальных случаях обновим, но без обновления логина и пароля
    delete updateUserDto.login;
    delete updateUserDto.password;

    const updated = await this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true });

    return updated;
  }

  async remove(id: string) {
    const deleted = await this.userModel.findByIdAndRemove(id);
    return deleted;
  }
}
