import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UserService } from '../user/user.service';
import { logger } from '../shared/logger.middleware';

@Injectable()
export class AuthService {
  constructor(private userService: UserService, private jwtService: JwtService) {}

  async signIn(createAuthDto: CreateAuthDto): Promise<null | string> {
    console.log(createAuthDto);
    logger.info(`Пользователь: ${createAuthDto.login}. Аутентификация.`);
    const user = await this.userService.findAll({ login: createAuthDto.login });

    // если пользователь не найден или у него нет права на вход
    if (!user[0] || !user[0].canAuth || !user[0].password) {
      logger.info(`Пользователь ${createAuthDto} не найден или вход не разрешён.`);
      return null;
    }

    const isValidPassword = await bcrypt.compare(createAuthDto.password, user[0].password);

    if (!isValidPassword) {
      logger.debug(`Пользователь ${createAuthDto.login}. Неправильный пароль.`);
      return null;
    }

    const payload = { sub: user[0]._id, login: user[0].login };
    const token = await this.jwtService.signAsync(payload);

    logger.info(`Пользователь ${createAuthDto.login}. Успешная аутентификация. Выпущен токен.`);

    return token;
  }
}
