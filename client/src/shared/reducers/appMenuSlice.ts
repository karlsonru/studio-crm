import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export enum MenuWidth {
  FULL = 200,
  SMALL = 55,
}

interface IMenuState {
  width: MenuWidth;
  title: string;
  mobileMenuAnchorEl: null | string;
}

const initialState: IMenuState = {
  width: MenuWidth.SMALL,
  title: document.title,
  mobileMenuAnchorEl: null,
};

export const appMenuState = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    setFullWidth: (state) => {
      state.width = MenuWidth.FULL;
    },
    setSmallWidth: (state) => {
      state.width = MenuWidth.SMALL;
    },
    setPageTitle: (state, action: PayloadAction<string>) => {
      state.title = action.payload;
    },
    setMobileMenuAnchorEl: (state, action: PayloadAction<string | null>) => {
      state.mobileMenuAnchorEl = action.payload;
    },
  },
});

export const { reducer: appMenuReducer, actions: appMenuActions } = appMenuState;
