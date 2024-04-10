import { api } from './basicApi';
import { IAttendanceModel } from '../models/IAttendanceModel';

const tag = 'statistic';
const route = 'statistic';

api.addTagTypes(tag);

interface IAttendancesWithStatistic {
  attendances: Array<IAttendanceModel>;
  statistic: Record<string, number>;
}

export interface IStatisticArgs {
  query: Record<string, unknown>;
  id?: string;
}

const apiResource = api.getResource();

export const { useGetVisitedLessonsStatisticByStudentQuery } = apiResource.injectEndpoints({
  endpoints: (build) => ({
    getVisitedLessonsStatisticByStudent:
      build
        .query<IAttendancesWithStatistic, IStatisticArgs>(
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

export const { useGetIncomeStatisticQuery } = apiResource.injectEndpoints({
  endpoints: (build) => ({
    getIncomeStatistic:
      build
        .query<IIncomeStatistic, IStatisticArgs>(
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

export const { useGetIncomeByUserQuery } = apiResource.injectEndpoints({
  endpoints: (build) => ({
    getIncomeByUser:
      build
        .query<number, IStatisticArgs>(
        {
          query: ({ query, id }) => (
            {
              url: `${route}/finance/income/user/${id}`,
              params: { filter: JSON.stringify(query) },
            }
          ),
          providesTags: [tag as any],
        },
      ),
  }),
});
