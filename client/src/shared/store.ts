import { configureStore } from '@reduxjs/toolkit';
import menuReducer from './reducers/appMenuSlice';
import lessonPageReduer from './reducers/lessonPageSlice';
import {
  usersApi,
  locationsApi,
  lessonsApi,
} from './reducers/api';

const store = configureStore({
  reducer: {
    menuReducer,
    lessonPageReduer,
    [usersApi.reducerPath]: usersApi.reducer,
    [locationsApi.reducerPath]: locationsApi.reducer,
    [lessonsApi.reducerPath]: lessonsApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware()
    .concat(usersApi.middleware, lessonsApi.middleware, locationsApi.middleware),
});

export default store;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
