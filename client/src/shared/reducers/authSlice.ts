import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IAuthState {
  login: string | null;
  token: string | null;
  role: string | null;
}

const initialState: IAuthState = {
  login: localStorage.getItem('login'),
  token: localStorage.getItem('token'),
  role: null,
};

const authState = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLogin: (state, action: PayloadAction<string | null>) => {
      state.login = action.payload;

      if (action.payload) {
        localStorage.setItem('login', action.payload);
      } else {
        localStorage.removeItem('login');
      }
    },

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
