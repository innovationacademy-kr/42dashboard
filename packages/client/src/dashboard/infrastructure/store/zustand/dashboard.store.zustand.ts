import StickerDataType from '../../../domain/stickerDatas/stickerData.type';
import create from 'zustand';
import { devtools } from 'zustand/middleware';
import ControlModeType from '../../../domain/controlMode/controlMode.type';
import PresetType from '../../../domain/preset/preset.type';
import UserType from '../../../domain/user/user.type';
import SectionDataType from '../../../domain/sectionDatas/sectionData.type';

export interface DashBoardState {
  user: UserType | null;
  preset: PresetType | null;
  controlMode: ControlModeType;
  filtersModal: boolean;
  stickerDatas: StickerDataType[];
  sectionDatas: SectionDataType[];
}

const store = create<DashBoardState, [['zustand/devtools', DashBoardState]]>(
  devtools((set) => ({
    user: null,
    preset: null,
    controlMode: 'view',
    filtersModal: false,
    stickerDatas: [],
    sectionDatas: [],
  })),
);

export default store;
