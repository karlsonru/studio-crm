export interface IFinanceCategoryModel {
  _id: string;
  name: string;
}

export interface IFinanceCategoryModelCreate extends Omit<IFinanceCategoryModel, '_id'> {}
