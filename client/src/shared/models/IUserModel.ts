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
  login?: string,
  password?: string;
  salary?: number;
  phone: number;
  isActive: boolean;
}

export interface IUserModelCreate extends Omit<IUserModel, '_id'> {}
