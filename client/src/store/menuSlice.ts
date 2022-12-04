/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IMenuState {
  width: number;
  title: string;
  mobileMenuAnchorEl: null | string;
}

const initialState: IMenuState = {
  width: 55,
  title: document.title,
  mobileMenuAnchorEl: null,
};

export const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    setFullWidth: (state) => {
      state.width = 200;
    },
    setSmallWidth: (state) => {
      state.width = 55;
    },
    setPageTitle: (state, action: PayloadAction<string>) => {
      state.title = action.payload;
    },
    setMobileMenuAnchorEl: (state, action: PayloadAction<string | null>) => {
      state.mobileMenuAnchorEl = action.payload;
    },
  },
});

export const {
  setFullWidth,
  setSmallWidth,
  setPageTitle,
  setMobileMenuAnchorEl,
} = menuSlice.actions;

export default menuSlice.reducer;
