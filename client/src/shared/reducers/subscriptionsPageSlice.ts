import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ISubscriptionsPageState {
  templates: {
    filters: {
      title: string;
      status: string;
    },
  },
}

const initialState: ISubscriptionsPageState = {
  templates: {
    filters: {
      title: '',
      status: 'active',
    },
  },
};

const subscriptionsPageState = createSlice({
  name: 'subscriptionsPage',
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
  reducer: subscriptionsPageReducer,
  actions: subscriptionsPageActions,
} = subscriptionsPageState;
