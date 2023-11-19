import { basicApi } from './basicApi';
import { IAttendanceModel } from '../models/IAttendanceModel';

const tag = 'statistic';
const route = 'statistic';

basicApi.enhanceEndpoints({ addTagTypes: [tag] });

interface IAttendancesWithStatistic {
  attendances: Array<IAttendanceModel>;
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

export const { useGetIncomeStatisticQuery } = basicApi.injectEndpoints({
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

export const { useGetIncomeByUserQuery } = basicApi.injectEndpoints({
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
