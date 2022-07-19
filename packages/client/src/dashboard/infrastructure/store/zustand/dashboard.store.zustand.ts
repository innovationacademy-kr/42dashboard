import StickerDataType from '../../../domain/stickerDatas/stickerData.type';
import create from 'zustand';
import { devtools } from 'zustand/middleware';
import ControlModeType from '../../../domain/controlMode/controlMode.type';
import PresetType from '../../../domain/preset/preset.type';
import UserType from '../../../domain/user/user.type';
import SectionDataType from '../../../domain/sectionDatas/sectionData.type';
import BoardDataType from '../../../domain/boardData/boardData.type';

export interface DashBoardState {
  user: UserType | null;
  preset: PresetType | null;
  controlMode: ControlModeType;
  filtersModal: boolean;
  boardData: BoardDataType | null;
  sectionDatas: SectionDataType[];
  stickerDatas: StickerDataType[];
}

const store = create<DashBoardState, [['zustand/devtools', DashBoardState]]>(
  devtools((set) => ({
    user: null,
    preset: null,
    controlMode: 'view',
    filtersModal: false,
    boardData: null,
    sectionDatas: [],
    stickerDatas: [],
  })),
);

export default store;
