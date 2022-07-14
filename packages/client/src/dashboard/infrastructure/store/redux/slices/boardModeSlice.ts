import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface BoardModeState {
  mode: string;
}

const initialState = {
  mode: 'view',
} as BoardModeState;

const boardModeSlice = createSlice({
  name: 'boardMode',
  initialState,
  reducers: {
    changeMode: (state, action: PayloadAction<string>) => {
      state.mode = action.payload;
    },
  },
});

export const boardModeActions = boardModeSlice.actions;
export default boardModeSlice.reducer;
