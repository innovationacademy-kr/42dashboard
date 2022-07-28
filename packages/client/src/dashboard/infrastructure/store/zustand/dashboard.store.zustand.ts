import StickerDataType from '../../../domain/stickerDatas/stickerData.type';
import create from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import ControlModeType from '../../../domain/controlMode/controlMode.type';
import PresetType from '../../../domain/preset/preset.type';
import UserType from '../../../domain/user/user.type';
import SectionDataType from '../../../domain/sectionDatas/sectionData.type';
import BoardDataType from '../../../domain/boardData/boardData.type';
import PresetListType from '../../../domain/presetList/presetList.type';

export interface DashBoardState {
  user: UserType | null;
  preset: PresetType | null;
  presetList: PresetListType;
  controlMode: ControlModeType;
  filtersModal: boolean;
  boardData: BoardDataType;
  sectionDatas: SectionDataType[];
  stickerDatas: StickerDataType[];
}

const store = create<DashBoardState>()(
  devtools(
    persist((set) => ({
      user: null,
      preset: null,
      presetList: { presetInfos: [] },
      controlMode: 'view',
      filtersModal: false,
      boardData: { sectionIds: [], sectionLayouts: [] },
      sectionDatas: [],
      stickerDatas: [],
    })),
  ),
);

export default store;
