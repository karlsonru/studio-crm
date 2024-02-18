import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getTodayTimestamp } from '../helpers/getTodayTimestamp';

interface IAttendancePageState {
  searchLessonId: string,
  searchDateTimestamp: number;
}

const initialState: IAttendancePageState = {
  searchLessonId: '',
  searchDateTimestamp: getTodayTimestamp(),
};

const attendancePageState = createSlice({
  name: 'attendancePage',
  initialState,
  reducers: {
    setSearchDateTimestamp: (state, action: PayloadAction<number>) => {
      state.searchDateTimestamp = action.payload;
    },

    setSearchLessonId: (state, action: PayloadAction<string>) => {
      state.searchLessonId = action.payload;
    },
  },
});

export const {
  reducer: attendancePageReducer,
  actions: attendancePageActions,
} = attendancePageState;
