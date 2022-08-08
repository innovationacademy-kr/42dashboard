import StickerDataType from './stickerData.type';

export default interface StickersDatasRepositoryInterface {
  getStickerData: (id: string) => StickerDataType;
  updateStickerData: (id: string, newStickerData: StickerDataType) => void;
  addStickerData: (newStickerData: StickerDataType) => void;
  removeStickerData: (id: string) => void;
}
