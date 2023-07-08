import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getTodayTimestamp } from '../helpers/getTodayTimestamp';

/*
export interface IVisit {
  _id?: string;
  student: string;
  visitStatus: VisitStatus;
  visitType: VisitType;
}
*/

interface IAttendancePageState {
  currentLessonId: string,
  currentDateTimestamp: number;
}

const initialState: IAttendancePageState = {
  currentLessonId: '',
  currentDateTimestamp: getTodayTimestamp(),
};

const attendancePageState = createSlice({
  name: 'attendancePage',
  initialState,
  reducers: {
    setCurrentDateTimestamp: (state, action: PayloadAction<number>) => {
      state.currentDateTimestamp = action.payload;
    },

    setCurrentLessonId: (state, action: PayloadAction<string>) => {
      state.currentLessonId = action.payload;
    },
  },
});

export const {
  reducer: attendancePageReducer,
  actions: attendancePageActions,
} = attendancePageState;
