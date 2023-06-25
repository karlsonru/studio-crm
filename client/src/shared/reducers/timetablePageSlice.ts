import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getTodayTimestamp } from '../helpers/getTodayTimestamp';
import { ILessonModel } from '../models/ILessonModel';

interface ILessonDetails {
  date: number | null;
  selectedLesson: ILessonModel | null;
}

interface ITimetablePageState {
  currentDate: number;
  view: 'day' | 'week';
  lessonDetails: ILessonDetails;
}

const initialState: ITimetablePageState = {
  currentDate: getTodayTimestamp(),
  view: 'week',
  lessonDetails: {
    date: null,
    selectedLesson: null,
  },
};

const timetablePageState = createSlice({
  name: 'timetablePage',
  initialState,
  reducers: {
    setCurrentDate: (state, action: PayloadAction<number>) => {
      state.currentDate = action.payload;
    },
    setView: (state, action: PayloadAction<'day' | 'week'>) => {
      state.view = action.payload;
    },
    setLessonDetails: (state, action: PayloadAction<ILessonDetails>) => {
      state.lessonDetails = action.payload;
    },
  },
});

export const { reducer: timetablePageReducer, actions: timetablePageActions } = timetablePageState;
