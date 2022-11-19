import { Model } from 'mongoose';

export interface IBasicQuery {
  [index: string]: string | number;
}

export interface IBasicItem extends IBasicQuery {}

export class BasicServices {
  // костыль для расширения класса новыми функциями
  // @ts-ignore
  [x: string]: any;

  db: typeof Model;

  constructor(model: typeof Model) {
    this.db = model;
  }

  getAll = async () => {
    const results = await this.db.find({});
    return results;
  };

  getOne = async (id: string) => {
    const result = await this.db.findById(id);
    return result;
  };

  find = async (query: IBasicQuery, limit: number) => {
    const result = await this.db.find(query).limit(limit);
    return result;
  };

  create = async (item: IBasicItem, query: IBasicQuery) => {
    const candidate = await this.db.find(query);

    if (candidate.length) {
      return null;
    }

    const newItem = await this.db.create(item);

    return newItem;
  };

  update = async (id: string, item: IBasicItem) => {
    const updatedItem = await this.db.findByIdAndUpdate(id, item, { new: true });
    return updatedItem;
  };

  delete = async (id: string) => {
    const removedItem = await this.db.findByIdAndDelete(id);
    return removedItem;
  };
}
