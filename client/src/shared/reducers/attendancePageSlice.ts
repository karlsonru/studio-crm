import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getTodayTimestamp } from '../helpers/getTodayTimestamp';

interface IAttendancePageState {
  searchLessonId: string,
  searchDateTimestamp: number;
  editPostponedAttendanceId: string;
  editPostponedAttendanceStudentId: string;
  editPostponedAttendanceModalOpen: boolean;
  showPostponedAttendanceModalOpen: boolean;
}

const initialState: IAttendancePageState = {
  searchLessonId: '',
  searchDateTimestamp: getTodayTimestamp(),
  editPostponedAttendanceId: '',
  editPostponedAttendanceStudentId: '',
  showPostponedAttendanceModalOpen: false,
  editPostponedAttendanceModalOpen: false,
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

    setEditPostonedAttendanceId: (state, action: PayloadAction<string>) => {
      state.editPostponedAttendanceId = action.payload;
    },

    setEditPostponedAttendanceStudentId: (state, action: PayloadAction<string>) => {
      state.editPostponedAttendanceStudentId = action.payload;
    },

    setEditPostponedAttendanceModalOpen: (state, action: PayloadAction<boolean>) => {
      state.editPostponedAttendanceModalOpen = action.payload;
    },
    setShowPostponedAttendanceModalOpen: (state, action: PayloadAction<boolean>) => {
      state.showPostponedAttendanceModalOpen = action.payload;
    },
  },
});

export const {
  reducer: attendancePageReducer,
  actions: attendancePageActions,
} = attendancePageState;
