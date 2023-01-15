import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ILessonPageFiltersState {
  titleFilter: string;
  sizeFilter: string;
  statusFilter: string;
}

const initialState: ILessonPageFiltersState = {
  titleFilter: '',
  sizeFilter: 'groups',
  statusFilter: 'active',
};

const lessonsPageState = createSlice({
  name: 'lessonPage',
  initialState,
  reducers: {
    setTitleFilter: (state, action: PayloadAction<string>) => {
      state.titleFilter = action.payload;
    },
    setSizeFilter: (state, action: PayloadAction<string>) => {
      state.sizeFilter = action.payload;
    },
    setStatusFilter: (state, action: PayloadAction<string>) => {
      state.statusFilter = action.payload;
    },
  },
});

export const { reducer: lessonsPageReducer, actions: lessonsPageActions } = lessonsPageState;
