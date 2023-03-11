import { BasicServices, IBasicQuery } from '../../shared/component';

export class SubscriptionServices extends BasicServices {
  find = async (bodyQuery: IBasicQuery, limit: number) => {
    const result = await this.db.find(bodyQuery)
      .populate(this.populateQuery)
      .limit(limit)
      .sort({ createdAt: 1 });

    return result;
  };
}
