import { configureStore } from '@reduxjs/toolkit';
import menuReducer from './reducers/appMenuSlice';
import { lessonsPageReducer } from './reducers/lessonsPageSlice';
import { studentsPageReducer } from './reducers/studentsPageSlice';
import { subscribtionsPageReducer } from './reducers/subscribtionsPageSlice';
import { basicApi } from './api/basicApi';

const store = configureStore({
  reducer: {
    menuReducer,
    lessonsPageReducer,
    studentsPageReducer,
    subscribtionsPageReducer,
    [basicApi.reducerPath]: basicApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(basicApi.middleware),
});

export default store;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
