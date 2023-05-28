import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ITimetablePageState {
  currentDate: number;
  view: 'day' | 'week';
}

const now = new Date();
now.setHours(0);
now.setMinutes(0);
now.setSeconds(0);
now.setMilliseconds(0);

const initialState: ITimetablePageState = {
  currentDate: now.getTime(),
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
