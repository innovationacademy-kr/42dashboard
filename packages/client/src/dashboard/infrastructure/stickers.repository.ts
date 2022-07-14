import StickersRepositoryInterface from '../domain/stickers/stickers.repository.interface';
import StickerDataType from '../domain/stickers/stickers.type';
import stickersStore from './store/stickers.store';

class StickersRepository implements StickersRepositoryInterface {
  public getSticker(id: string) {
    const stickers = stickersStore.getStickers();
    return stickers.find((sticker) => sticker.id === id) as StickerDataType;
  }

  public async addSticker(sticker: StickerDataType) {
    const stickers = stickersStore.getStickers();
    stickers.push(sticker);
    console.log(stickers);
    stickersStore.setStickers(stickers);
  }

  public async removeSticker(id: string) {
    const stickers = stickersStore
      .getStickers()
      .filter((sticker) => sticker.id !== id);
    stickersStore.setStickers(stickers);
  }
}

export default new StickersRepository();
