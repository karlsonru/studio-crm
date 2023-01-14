import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ILessonFilter {
  id: string;
  title: string;
}

interface IStudentsPageState {
  nameFilter: string;
  phoneFilter: string;
  lessonsFilter: Array<ILessonFilter>;
  statusFilter: string;
  ageFromFilter?: number;
  ageToFilter?: number;
}

const initialState: IStudentsPageState = {
  nameFilter: '',
  phoneFilter: '',
  lessonsFilter: [],
  statusFilter: '',
};

const studentsPageState = createSlice({
  name: 'studentsPage',
  initialState,
  reducers: {
    setNameFilter: (state, action: PayloadAction<string>) => {
      state.nameFilter = action.payload;
    },
    setPhoneFilter: (state, action: PayloadAction<string>) => {
      state.phoneFilter = action.payload;
    },
    setLessonsFilter: (state, action: PayloadAction<Array<ILessonFilter>>) => {
      state.lessonsFilter = action.payload;
    },
    setStatusFilter: (state, action: PayloadAction<string>) => {
      state.statusFilter = action.payload;
    },
    setAgeFromFilter: (state, action: PayloadAction<number>) => {
      state.ageFromFilter = action.payload;
    },
    setAgeToFilter: (state, action: PayloadAction<number>) => {
      state.ageToFilter = action.payload;
    },
  },
});

export const { reducer: studentsPageReducer, actions: studentsPageActions } = studentsPageState;
