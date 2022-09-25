import bcryptjs from 'bcryptjs';
import { User, Role } from '../../models';
import { IUser } from './types';

export class UserServices {
  static async getAll() {
    const users = await User.find({});
    return users;
  }

  static async getOne(login: string) {
    const user = await User.findOne({ login });
    return user;
  }

  static async create(user: IUser) {
    const candidate = await this.getOne(user.login);

    if (candidate) {
      return null;
    }

    const role = await Role.findOne({ value: user.role });
    const passHash = await bcryptjs.hash(user.password, 7);

    const newUser = await User.create({
      ...user,
      password: passHash,
      birthday: +user.birthday,
      role: role?.value,
      isActive: true,
    });

    return newUser;
  }

  static async update(login: string, user: IUser) {
    const updatedUser = await User.findOneAndUpdate({ login }, user, { returnDocument: 'after' });
    return updatedUser;
  }

  static async delete(login: string) {
    const removeUser = await User.findOneAndDelete({ login });
    return removeUser;
  }
}
