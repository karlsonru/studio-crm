import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ILessonModel } from 'shared/models/ILessonModel';

interface IVisitPageState {
  lessons: ILessonModel[],
  lessonsIds: string[],
  currentLesson?: ILessonModel,
  currentDateTimestamp: number;
}

const initialState: IVisitPageState = {
  lessons: [],
  lessonsIds: [],
  currentDateTimestamp: 0,
};

const visitsPageState = createSlice({
  name: 'visitsPage',
  initialState,
  reducers: {
    setCurrentDateTimestamp: (state, action: PayloadAction<number>) => {
      state.currentDateTimestamp = action.payload;
    },
  },
});

export const { reducer: visitsPageReducer, actions: visitsPageActions } = visitsPageState;
