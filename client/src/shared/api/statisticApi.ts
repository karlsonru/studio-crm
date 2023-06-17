import {
  basicApi,
  IResponse,
} from './basicApi';
import { IVisitModel } from '../models/IVisitModel';

const tag = 'statistic';
const route = 'statistic';

basicApi.enhanceEndpoints({ addTagTypes: [tag] });

interface IVisitedLessonsWithStatistic {
  visitedLessons: Array<IVisitModel>;
  statistic: Record<string, number>;
}

export interface IStatisticArgs {
  query: Record<string, unknown>;
  id?: string;
}

export const { useGetVisitedLessonsStatisticByStudentQuery } = basicApi.injectEndpoints({
  endpoints: (build) => ({
    getVisitedLessonsStatisticByStudent:
      build
        .query<IResponse<IVisitedLessonsWithStatistic>, IStatisticArgs>(
        {
          query: ({ query, id }) => (
            {
              url: `${route}/visited-lessons/${id}`,
              params: { filter: JSON.stringify(query) },
            }
          ),
          providesTags: [tag as any],
        },
      ),
  }),
});

interface IIncomeStatistic {
  income: Array<number>;
  amount: Array<number>;
  expenses: Array<number>;
}

export const { useGetIncomeStatisticQuery } = basicApi.injectEndpoints({
  endpoints: (build) => ({
    getIncomeStatistic:
      build
        .query<IResponse<IIncomeStatistic>, IStatisticArgs>(
        {
          query: ({ query, id }) => (
            {
              url: `${route}/finance/income/${id}`,
              params: { filter: JSON.stringify(query) },
            }
          ),
          providesTags: [tag as any],
        },
      ),
  }),
});
