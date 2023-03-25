import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ILessonModel } from 'shared/models/ILessonModel';

interface IVisitPageState {
  lessons: ILessonModel[],
  lessonsIds: string[],
  currentLesson?: ILessonModel,
  currentLessonId: string,
  currentDateTimestamp: number;
}

const initialState: IVisitPageState = {
  lessons: [],
  lessonsIds: [],
  currentLessonId: '',
  currentDateTimestamp: 0,
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
  },
});

export const { reducer: visitsPageReducer, actions: visitsPageActions } = visitsPageState;
