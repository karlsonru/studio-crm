import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { createHash } from 'crypto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserModel, UserDocument } from '../schemas';
import { logger } from '../shared/logger.middleware';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserModel.name)
    private readonly userModel: Model<UserDocument>,
  ) {}
  async #createPasswordHash(password: string) {
    const hash = createHash('sha-256');
    const passHash = hash.update(password);
    return passHash.digest('hex');
  }

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
      createUserDto.password = await this.#createPasswordHash(createUserDto.password);
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

  async findAll(): Promise<Array<UserModel>> {
    return await this.userModel.find({});
  }

  async findOne(id: string): Promise<UserModel | null> {
    return await this.userModel.findById(id);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserModel | null> {
    logger.info(
      `Обновление пользователя ${updateUserDto.fullname}. Авторизация: ${updateUserDto.canAuth}. ID: ${id}`,
    );

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
      const user = await this.findOne(id);

      if (!user) {
        logger.debug(`Пользователь для обновления не найден. ID: ${id}`);
        return null;
      }

      if (!updateUserDto.password) {
        logger.debug(
          `Не передан пароль для обновления пользователя ${updateUserDto.fullname}. ID: ${id}`,
        );
        return null;
      }

      const passwordHash = await this.#createPasswordHash(updateUserDto.password);

      if (user.password && user.password !== passwordHash) {
        logger.debug(
          `Пользователь ${updateUserDto.fullname}. Старый и новый пароль не совпадают. Отказано в обновлении. ID: ${id}`,
        );
        return null;
      }

      const newPassword = await this.#createPasswordHash(updateUserDto.newPassword);

      logger.info(`Пользователь ${updateUserDto.fullname}. Установлен новый пароль. ID: ${id}`);

      const updated = await this.userModel.findByIdAndUpdate(
        id,
        { ...updateUserDto, password: newPassword },
        { new: true },
      );

      return updated;
    }

    logger.info(`Пользователь ${updateUserDto.fullname}. Выполнено обновление. ID: ${id}`);

    // в остальных случаях обновим, но без обновления логина и пароля
    const { login, password, ...rest } = updateUserDto;

    const updated = await this.userModel.findByIdAndUpdate(id, rest, {
      new: true,
    });

    return updated;
  }

  async remove(id: string) {
    await this.userModel.findByIdAndRemove(id);
    return;
  }
}
