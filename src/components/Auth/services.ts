import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import { User, IRole } from '../../models';

const secret = process.env.TOKEN_SECRET ?? 'helloWorld';

export class AuthServices {
  static generateAccessToken(id: string, role: string) {
    const payload = {
      id,
      role,
    };
    return jwt.sign(payload, secret, { expiresIn: '24h' });
  }

  static async login(login: string, password: string) {
    const user = await User.findOne({ login }).populate<{ role: IRole }>('Role');

    if (!user) {
      return null;
    }

    const isValid = bcryptjs.compareSync(password, user.password);

    if (!isValid) {
      return null;
    }

    return this.generateAccessToken(user.id, user.role.value);
  }
}
