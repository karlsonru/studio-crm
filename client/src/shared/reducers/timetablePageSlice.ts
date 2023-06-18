import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getTodayTimestamp } from '../helpers/getTodayTimestamp';

interface ITimetablePageState {
  currentDate: number;
  view: 'day' | 'week';
}

const initialState: ITimetablePageState = {
  currentDate: getTodayTimestamp(),
  view: 'week',
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
  },
});

export const { reducer: timetablePageReducer, actions: timetablePageActions } = timetablePageState;
