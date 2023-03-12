import { Model } from 'mongoose';

interface IPopulateQuery {
  path: string,
  select: string,
}

export interface IBasicQuery {
  [index: string]: string | number;
}

export interface IBasicItem extends IBasicQuery {}

export class BasicServices {
  db: typeof Model;

  populateQuery: Array<IPopulateQuery | string>;

  constructor(model: typeof Model, populateQueries?: Array<IPopulateQuery | string>) {
    this.db = model;
    this.populateQuery = populateQueries ?? [];
  }

  getAll = async () => {
    const results = await this.db.find({}).populate(this.populateQuery);
    return results;
  };

  getOne = async (id: string) => {
    const result = await this.db.findById(id).populate(this.populateQuery);
    return result;
  };

  find = async (query: IBasicQuery) => {
    const result = await this.db.find(query).populate(this.populateQuery);
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
