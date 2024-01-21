import { configureStore } from '@reduxjs/toolkit';
import { menuReducer } from './reducers/appMenuSlice';
import { timetablePageReducer } from './reducers/timetablePageSlice';
import { lessonsPageReducer } from './reducers/lessonsPageSlice';
import { studentsPageReducer } from './reducers/studentsPageSlice';
import { subscriptionsPageReducer } from './reducers/subscriptionsPageSlice';
import { attendancePageReducer } from './reducers/attendancePageSlice';
import { authReducer } from './reducers/authSlice';
import { financeReducer } from './reducers/financeSlice';
import { basicApi } from './api/basicApi';

const store = configureStore({
  reducer: {
    authReducer,
    attendancePageReducer,
    menuReducer,
    timetablePageReducer,
    lessonsPageReducer,
    studentsPageReducer,
    subscriptionsPageReducer,
    financeReducer,
    [basicApi.reducerPath]: basicApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(basicApi.middleware),
  devTools: true,
});

export default store;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
