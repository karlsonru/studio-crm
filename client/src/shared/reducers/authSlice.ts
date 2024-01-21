import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IAuthState {
  token: string | null;
  role: string | null;
}

const initialState: IAuthState = {
  token: localStorage.getItem('token'),
  role: null,
};

const authState = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string | null>) => {
      state.token = action.payload;

      if (action.payload) {
        localStorage.setItem('token', action.payload);
      } else {
        localStorage.removeItem('token');
      }
    },

    setRole: (state, action: PayloadAction<string | null>) => {
      state.role = action.payload;
    },
  },
});

export const { reducer: authReducer, actions: authActions } = authState;
