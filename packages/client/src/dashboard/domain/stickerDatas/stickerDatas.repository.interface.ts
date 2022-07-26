import StickerDataType from './stickerData.type';

export default interface StickersDatasRepositoryInterface {
  getStickerData: (id: string) => StickerDataType;
  addStickerData: (newStickerData: StickerDataType) => void;
  removeStickerData: (id: string) => void;
}
