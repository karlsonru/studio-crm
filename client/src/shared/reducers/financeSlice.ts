import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getTodayTimestamp } from '../helpers/getTodayTimestamp';
import { FINANCE_PERIOD_DEFAULT } from '../constants';
import { IFinanceModel } from '../models/IFinanceModel';

interface IFinanceFilters {
  period: number;
  dateFrom: number;
  location: string;
}

interface IFinanceState {
  income: IFinanceFilters;
  expenses: IFinanceFilters;
  isConfirmationDialog: boolean;
  currentFinanceRecord: IFinanceModel | null;
}

const today = new Date(getTodayTimestamp());
today.setMonth(today.getMonth() - FINANCE_PERIOD_DEFAULT + 1);
today.setDate(1);
const dateFrom = today.getTime();

const initialState: IFinanceState = {
  income: {
    period: FINANCE_PERIOD_DEFAULT,
    dateFrom,
    location: 'all',
  },
  expenses: {
    period: FINANCE_PERIOD_DEFAULT,
    dateFrom,
    location: 'all',
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
