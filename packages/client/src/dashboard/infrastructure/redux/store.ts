import { configureStore } from '@reduxjs/toolkit';
import boardModeSlice from './slices/boardModeSlice';

const store = configureStore({
  reducer: {
    mode: boardModeSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
