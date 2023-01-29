import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ISubscribtionsPageState {
  templates: {
    filters: {
      title: string;
      status: string;
    },
  },
}

const initialState: ISubscribtionsPageState = {
  templates: {
    filters: {
      title: '',
      status: 'active',
    },
  },
};

const subscribtionsPageState = createSlice({
  name: 'subscribtionsPage',
  initialState,
  reducers: {
    setTemplateFilterTitle: (state, action: PayloadAction<string>) => {
      state.templates.filters.title = action.payload;
    },
    setTemplateFilterStatus: (state, action: PayloadAction<string>) => {
      state.templates.filters.status = action.payload;
    },
  },
});

export const {
  reducer: subscribtionsPageReducer,
  actions: subscribtionsPageActions,
} = subscribtionsPageState;
