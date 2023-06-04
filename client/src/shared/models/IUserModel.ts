export enum UserRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  TEACHER = 'teacher',
  OTHER = 'other',
}

export const userRoleLocal = {
  [UserRole.OWNER]: 'Владелец',
  [UserRole.ADMIN]: 'Администратор',
  [UserRole.TEACHER]: 'Педагог',
  [UserRole.OTHER]: 'Другая',
};

export interface IUserModel {
  _id: string;
  fullname: string;
  role: UserRole,
  birthday: number;
  phone: number;
  salary?: number;
  canAuth: boolean;
  login?: string,
  password?: string;
  isActive: boolean;
}

export interface IUserModelCreate extends Omit<IUserModel, '_id'> {}
