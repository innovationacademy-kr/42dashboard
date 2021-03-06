import { configureStore } from '@reduxjs/toolkit';
import boardModeSlice from './slices/boardModeSlice';
import boardPresetSlice from './slices/boardPresetSlice';

const store = configureStore({
  reducer: {
    mode: boardModeSlice,
    presetName: boardPresetSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
