import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type PresetNameType =
  | 'summary'
  | 'cadetLearning'
  | 'cadetAcademic'
  | 'laPicine'
  | 'applicant';

interface BoardPresetSlice {
  presetName: PresetNameType;
}

const initialState = {
  presetName: 'summary',
} as BoardPresetSlice;

const boardPresetSlice = createSlice({
  name: 'boardPreset',
  initialState,
  reducers: {
    changePreset: (state, action: PayloadAction<PresetNameType>) => {
      state.presetName = action.payload;
    },
  },
});

export const boardPresetActions = boardPresetSlice.actions;
export default boardPresetSlice.reducer;
