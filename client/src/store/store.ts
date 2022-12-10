import { configureStore } from '@reduxjs/toolkit';
import menuReducer from './slices/appMenuSlice';
import lessonPageReduer from './slices/lessonPageSlice';

const store = configureStore({
  reducer: {
    menuReducer,
    lessonPageReduer,
  },
});

export default store;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
