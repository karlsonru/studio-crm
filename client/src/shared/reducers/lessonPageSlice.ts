/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ILessonPageFiltersState {
  lessonTitleFilter: string;
  lessonSizeFilter: string;
  lessonActiveStatusFilter: string;
}

const initialState: ILessonPageFiltersState = {
  lessonTitleFilter: '',
  lessonSizeFilter: 'groups',
  lessonActiveStatusFilter: 'active',
};

export const lessonPageFiltersSlice = createSlice({
  name: 'lessonPageFilters',
  initialState,
  reducers: {
    setLessonTitleFilter: (state, action: PayloadAction<string>) => {
      state.lessonTitleFilter = action.payload;
    },
    setLessonSizeFilter: (state, action: PayloadAction<string>) => {
      state.lessonSizeFilter = action.payload;
    },
    setLessonActiveStatusFilter: (state, action: PayloadAction<string>) => {
      state.lessonActiveStatusFilter = action.payload;
    },
  },
});

export const {
  setLessonTitleFilter,
  setLessonSizeFilter,
  setLessonActiveStatusFilter,
} = lessonPageFiltersSlice.actions;

export default lessonPageFiltersSlice.reducer;
