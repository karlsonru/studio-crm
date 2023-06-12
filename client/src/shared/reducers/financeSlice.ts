import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getTodayTimestamp } from '../helpers/getTodayTimestamp';
import { FINANCE_PERIOD_DEFAULT } from '../constants';

interface IFinanceFilters {
  period: number;
  dateFrom: number;
  location: string;
}

interface IFinanceState {
  income: IFinanceFilters;
  expenses: IFinanceFilters;
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
  },
});

export const { reducer: financeReducer, actions: financeActions } = financeState;
