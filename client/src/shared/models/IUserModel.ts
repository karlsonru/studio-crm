export interface IUserModel {
  _id: string;
  login: string,
  role: string,
  fullname: string;
  birthday: number;
  isActive: boolean;
}

export interface IUserModelCreate extends Omit<IUserModel, '_id'> {}
