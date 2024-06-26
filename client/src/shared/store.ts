import { configureStore } from '@reduxjs/toolkit';
import { appMenuReducer } from './reducers/appMenuSlice';
import { timetablePageReducer } from './reducers/timetablePageSlice';
import { lessonsPageReducer } from './reducers/lessonsPageSlice';
import { studentsPageReducer } from './reducers/studentsPageSlice';
import { subscriptionsPageReducer } from './reducers/subscriptionsPageSlice';
import { attendancePageReducer } from './reducers/attendancePageSlice';
import { authReducer } from './reducers/authSlice';
import { financeReducer } from './reducers/financeSlice';
import { api } from './api/basicApi';

const apiResource = api.getResource();

const store = configureStore({
  reducer: {
    authReducer,
    appMenuReducer,
    attendancePageReducer,
    timetablePageReducer,
    lessonsPageReducer,
    studentsPageReducer,
    subscriptionsPageReducer,
    financeReducer,
    [apiResource.reducerPath]: apiResource.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiResource.middleware),
  devTools: true,
});

export default store;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
