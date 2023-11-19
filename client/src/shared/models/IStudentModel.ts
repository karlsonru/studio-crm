export interface IStudentModelContact {
  name: string;
  phone: number;
}

export enum KnowledgeSource {
  VK = 'vk',
  SITE = 'site',
  FRIENDS = 'friends',
  ADVERT_PAPER = 'advert_paper',
  ADVERT_CLINIC = 'advert_clinic',
  OTHER = 'other',
  UNKNOWN = 'unknown',
}

export interface IStudentModel {
  _id: string;
  fullname: string;
  sex: string;
  birthday: number;
  balance: number;
  contacts: Array<IStudentModelContact>;
  knowledgeSource?: KnowledgeSource,
  comment?: string;
  isActive: boolean;
}

export interface IStudentModalCreate extends Omit<IStudentModel, '_id'> {}
