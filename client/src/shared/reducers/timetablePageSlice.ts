import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getTodayTimestamp } from '../helpers/getTodayTimestamp';

interface ITimetablePageState {
  currentDate: number;
  view: 'day' | 'week';
  isShowDetails: boolean;
  selectedLesson: string | null;
}

const initialState: ITimetablePageState = {
  currentDate: getTodayTimestamp(),
  view: 'week',
  isShowDetails: false,
  selectedLesson: null,
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
    setShowDetails: (state, action: PayloadAction<boolean>) => {
      state.isShowDetails = action.payload;
    },
    setSelectedLesson: (state, action: PayloadAction<string | null>) => {
      state.selectedLesson = action.payload;
    },
  },
});

export const { reducer: timetablePageReducer, actions: timetablePageActions } = timetablePageState;
