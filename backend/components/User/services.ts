import bcryptjs from 'bcryptjs';
import { BasicServices, IBasicItem, IBasicQuery } from '../../shared/component';
import { User, Role } from '../../models';

export class UserServices extends BasicServices {
  create = async (user: IBasicItem, query: IBasicQuery) => {
    const candidate = await this.db.find(query);

    if (candidate.length) {
      return null;
    }

    const role = await Role.findOne({ value: user.role });

    if (role === null) {
      return null;
    }

    const passHash = await bcryptjs.hash(user.password.toString(), 7);

    const newUser = await User.create({
      ...user,
      password: passHash,
      birthday: +user.birthday,
      role: role.id,
      isActive: true,
    });

    return newUser;
  };
}
