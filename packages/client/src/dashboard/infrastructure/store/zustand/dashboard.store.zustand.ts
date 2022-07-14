import { StickerDataType } from './../../../domain/stickers/stickers.type';
import create from 'zustand';
import { devtools } from 'zustand/middleware';
import ControlModeType from '../../../domain/controlMode/controlMode.type';
import PresetType from '../../../domain/preset/preset.type';
import UserType from '../../../domain/user/user.type';

export interface DashBoardState {
  user: UserType | null;
  preset: PresetType | null;
  // presetList: PresetType[];
  controlMode: ControlModeType;
  stickers: StickerDataType[];
}

const store = create<DashBoardState, [['zustand/devtools', DashBoardState]]>(
  devtools((set) => ({
    user: null,
    preset: null,
    // presetList: [],
    controlMode: 'view',
    stickers: [],
  })),
);

export default store;
