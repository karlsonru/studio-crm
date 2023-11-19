import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IAuthState {
  token: string | null;
  role: string | null;
}

const initialState: IAuthState = {
  token: null,
  role: null,
};

const authState = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string | null>) => {
      state.token = action.payload;
    },

    setRole: (state, action: PayloadAction<string | null>) => {
      state.role = action.payload;
    },
  },
});

export const { reducer: authReducer, actions: authActions } = authState;
