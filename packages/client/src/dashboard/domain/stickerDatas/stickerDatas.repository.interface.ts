import StickerDataType from './stickerData.type';

export default interface StickersDatasRepositoryInterface {
  getSticker: (id: string) => StickerDataType;
  addSticker: (sticker: StickerDataType) => void;
  removeSticker: (id: string) => void;
}
