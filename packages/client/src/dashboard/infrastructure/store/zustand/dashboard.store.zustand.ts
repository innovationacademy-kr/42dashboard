import StickerDataType from '../../../domain/stickerDatas/stickerData.type';
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
  filtersModal: boolean;
  stickerDatas: StickerDataType[];
}

const store = create<DashBoardState, [['zustand/devtools', DashBoardState]]>(
  devtools((set) => ({
    user: null,
    preset: null,
    // presetList: [],
    controlMode: 'view',
    filtersModal: false,
    stickerDatas: [],
  })),
);

export default store;
