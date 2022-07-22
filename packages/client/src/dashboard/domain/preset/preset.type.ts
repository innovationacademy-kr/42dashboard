import BoardDataType from '../boardData/boardData.type';
import SectionDataType from '../sectionDatas/sectionData.type';
import StickerDataType from '../stickerDatas/stickerData.type';
export default interface PresetType {
  id: string;
  info: PresetInfoType;
  data: PresetDataType; //JSX raw string
}

export interface PresetDataType {
  boardData: BoardDataType;
  sectionDatas: SectionDataType[];
  stickerDatas: StickerDataType[];
}

export interface PresetInfoType {
  id: string;
  label: string;
  description?: string;
}
