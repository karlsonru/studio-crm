import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ILessonModel } from 'shared/models/ILessonModel';

export interface IVisit {
  student: string;
  visitStatus: string | number;
}

interface IVisitPageState {
  lessons: ILessonModel[],
  lessonsIds: string[],
  currentLesson?: ILessonModel,
  currentLessonId: string,
  currentDateTimestamp: number;
  visits: Array<IVisit>;
}

const initialState: IVisitPageState = {
  lessons: [],
  lessonsIds: [],
  currentLessonId: '',
  currentDateTimestamp: 0,
  visits: [],
};

const visitsPageState = createSlice({
  name: 'visitsPage',
  initialState,
  reducers: {
    setCurrentDateTimestamp: (state, action: PayloadAction<number>) => {
      state.currentDateTimestamp = action.payload;
    },
    setCurrentLessonId: (state, action: PayloadAction<string>) => {
      state.currentLessonId = action.payload;
    },
    setVisits: (state, action: PayloadAction<IVisit>) => {
      const student = state.visits.find((visit) => visit.student === action.payload.student);

      if (student) {
        student.visitStatus = action.payload.visitStatus;
      } else {
        state.visits.push(action.payload);
      }
    },
  },
});

export const { reducer: visitsPageReducer, actions: visitsPageActions } = visitsPageState;
