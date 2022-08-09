import { StickerContentFactoryProps } from '../../presentation/components/Sticker/StickerContentFactory';
import StickerDataType from './stickerData.type';

export default interface StickersDatasRepositoryInterface {
  getStickerData: (id: string) => StickerDataType;
  updateStickerData: (
    id: string,
    newStickerData: StickerContentFactoryProps,
  ) => void;
  addStickerData: (newStickerData: StickerDataType) => void;
  removeStickerData: (id: string) => void;
}
