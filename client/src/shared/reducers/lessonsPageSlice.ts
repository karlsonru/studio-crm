import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ILessonModel } from 'shared/models/ILessonModel';

interface ILessonPageFiltersState {
  lessons: ILessonModel[],
  lessonsIds: string[],
  currentLesson?: ILessonModel,
  isConfirmationDialog: boolean;
}

const initialState: ILessonPageFiltersState = {
  lessons: [],
  lessonsIds: [],
  isConfirmationDialog: false,
};

const lessonsPageState = createSlice({
  name: 'lessonPage',
  initialState,
  reducers: {
    setCurrentLesson: (state, action: PayloadAction<ILessonModel>) => {
      state.currentLesson = action.payload;
    },
    setConfirmationDialog: (state, action: PayloadAction<boolean>) => {
      state.isConfirmationDialog = action.payload;
    },
  },
});

export const { reducer: lessonsPageReducer, actions: lessonsPageActions } = lessonsPageState;
