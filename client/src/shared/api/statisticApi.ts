import { api } from './basicApi';
import { IAttendanceModel } from '../models/IAttendanceModel';

const tag = 'statistic';
const route = 'statistic';

api.addTagTypes(tag);

export interface IStatisticArgs {
  locationId: string;
  userId: string;
  month: number;
}

interface IAttendancesWithStatistic {
  attendances: Array<IAttendanceModel>;
  statistic: Record<string, number>;
}

const apiResource = api.getResource();

interface IVisitedLessonsByStudentArgs {
  id: string;
  monthes?: number;
}

export const { useGetVisitedLessonsStatisticByStudentQuery } = apiResource.injectEndpoints({
  endpoints: (build) => ({
    getVisitedLessonsStatisticByStudent:
      build
        .query<IAttendancesWithStatistic, IVisitedLessonsByStudentArgs>(
        {
          query: ({ id, monthes }) => (
            {
              url: `${route}/visited-lessons/${id}`,
              params: { monthes },
            }
          ),
          providesTags: [tag as any],
        },
      ),
  }),
});

export interface IFinanceStatisticArgs {
  locationId: string;
  userId: string;
  month: number;
}

interface IFinanceStatistic {
  income: Array<number>;
  subscriptionsAmount: Array<number>;
  expenses: Array<number>;
}

export const { useGetFinanceStatisticQuery } = apiResource.injectEndpoints({
  endpoints: (build) => ({
    getFinanceStatistic:
      build
        .query<IFinanceStatistic, IFinanceStatisticArgs>(
        {
          query: ({ locationId, month, userId }) => (
            {
              url: `${route}/finance/statistic/location/${locationId}`,
              params: { month, userId },
            }
          ),
          providesTags: [tag as any],
        },
      ),
  }),
});

interface IIncomeByUserArgs {
  month: number;
  userId: string;
}

export const { useGetIncomeByUserQuery } = apiResource.injectEndpoints({
  endpoints: (build) => ({
    getIncomeByUser:
      build
        .query<number, IIncomeByUserArgs>(
        {
          query: ({ month, userId }) => (
            {
              url: `${route}/finance/income/user/${userId}`,
              params: { month },
            }
          ),
          providesTags: [tag as any],
        },
      ),
  }),
});
