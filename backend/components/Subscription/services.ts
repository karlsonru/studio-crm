import { BasicServices, IBasicQuery } from '../../shared/component';

export class SubscriptionServices extends BasicServices {
  find = async (bodyQuery: IBasicQuery) => {
    const result = await this.db.find(bodyQuery)
      .populate(this.populateQuery)
      .sort({ createdAt: 1 });

    return result;
  };
}
