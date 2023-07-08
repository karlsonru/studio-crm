import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ILessonModel, VisitType } from '../models/ILessonModel';
import { VisitStatus } from '../models/IAttendanceModel';
import { getTodayTimestamp } from '../helpers/getTodayTimestamp';

export interface IVisit {
  _id?: string;
  student: string;
  visitStatus: VisitStatus;
  visitType: VisitType;
}

interface IVisitPageState {
  lessons: ILessonModel[],
  lessonsIds: string[],
  currentLesson?: ILessonModel,
  currentLessonId: string,
  isCurrentLessonVisited: boolean,
  currentDateTimestamp: number;
  visits: Array<IVisit>;
}

const initialState: IVisitPageState = {
  lessons: [],
  lessonsIds: [],
  currentLessonId: '',
  isCurrentLessonVisited: false,
  currentDateTimestamp: getTodayTimestamp(),
  visits: [],
};

const visitsPageState = createSlice({
  name: 'visitsPage',
  initialState,
  reducers: {
    setCurrentDateTimestamp: (state, action: PayloadAction<number>) => {
      state.currentDateTimestamp = action.payload;
    },

    setCurrentLessonLesson: (state, action: PayloadAction<ILessonModel>) => {
      state.currentLesson = action.payload;
    },

    setCurrentLessonId: (state, action: PayloadAction<string>) => {
      state.currentLessonId = action.payload;
    },

    setIsCurrentLessonVisited: (state, action: PayloadAction<boolean>) => {
      state.isCurrentLessonVisited = action.payload;
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
