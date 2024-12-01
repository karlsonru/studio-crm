import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getTodayTimestamp } from '../helpers/getTodayTimestamp';
import { IFinanceModel } from '../models/IFinanceModel';

interface IFinanceFilters {
  month: number;
  location: string;
  userId: string;
}

interface IFinanceState {
  income: IFinanceFilters;
  expenses: IFinanceFilters;
  isConfirmationDialog: boolean;
  currentFinanceRecord: IFinanceModel | null;
}

const currentMonth = new Date(getTodayTimestamp()).getMonth();

const initialState: IFinanceState = {
  income: {
    month: currentMonth,
    location: 'common',
    userId: 'all',
  },
  expenses: {
    month: currentMonth,
    location: 'common',
    userId: 'all',
  },
  isConfirmationDialog: false,
  currentFinanceRecord: null,
};

const financeState = createSlice({
  name: 'finance',
  initialState,
  reducers: {
    setIncomeFilters: (state, action: PayloadAction<IFinanceFilters>) => {
      state.income = action.payload;
    },

    setExpensesFilters: (state, action: PayloadAction<IFinanceFilters>) => {
      state.expenses = action.payload;
    },

    setConfirmationDialog: (state, action: PayloadAction<boolean>) => {
      state.isConfirmationDialog = action.payload;
    },

    setCurrentFinanceRecord: (state, action: PayloadAction<IFinanceModel | null>) => {
      state.currentFinanceRecord = action.payload;
    },
  },
});

export const { reducer: financeReducer, actions: financeActions } = financeState;
