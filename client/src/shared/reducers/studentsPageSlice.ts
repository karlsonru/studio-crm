import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ILessonFilter {
  id: string;
  title: string;
}

interface IStudentsPageState {
  filters: {
    fullname: string;
    phone: string;
    lessons: Array<ILessonFilter>;
    status: string;
    ageFrom?: number;
    ageTo?: number;
  },
  sort: {
    item: string,
    order: 'asc' | 'desc',
  }
}

const initialState: IStudentsPageState = {
  filters: {
    fullname: '',
    phone: '',
    lessons: [],
    status: '',
  },
  sort: {
    item: '',
    order: 'asc',
  },
};

const studentsPageState = createSlice({
  name: 'studentsPage',
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<Partial<typeof initialState.filters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setSort: (state, action: PayloadAction<Partial<typeof initialState.sort>>) => {
      state.sort = { ...state.sort, ...action.payload };
      console.log(state.sort);
    },

    // Вариант 2
    setSortItem: (state, action: PayloadAction<string>) => {
      state.sort.item = action.payload;
    },
    setSortOrder: (state, action: PayloadAction<'asc' | 'desc'>) => {
      state.sort.order = action.payload;
    },

    setSortName: (state, action: PayloadAction<string>) => {
      state.filters.fullname = action.payload;
    },
    // ....
  },
});

export const { reducer: studentsPageReducer, actions: studentsPageActions } = studentsPageState;
