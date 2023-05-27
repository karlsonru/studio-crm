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

interface IVisitedLessonsWithStatisticArgs {
  query: Record<string, unknown>;
  studentId: string;
}

export const { useGetVisitedLessonsStatisticByStudentQuery } = basicApi.injectEndpoints({
  endpoints: (build) => ({
    getVisitedLessonsStatisticByStudent:
      build
        .query<IResponse<IVisitedLessonsWithStatistic>, IVisitedLessonsWithStatisticArgs>(
        {
          query: ({ query, studentId }) => (
            {
              url: `${route}/visited-lessons/${studentId}`,
              params: { filter: JSON.stringify(query) },
            }
          ),
          providesTags: [tag as any],
        },
      ),
  }),
});
