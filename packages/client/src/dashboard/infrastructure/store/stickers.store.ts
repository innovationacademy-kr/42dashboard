import zustandStore from './zustand/dashboard.store.zustand';
import StickerDataType from '../../domain/stickers/stickers.type';

// ===================== ZUSTAND STORAGE =====================
class StickersStore {
  public subscribeToStickers(callback: (stickers: StickerDataType[]) => void) {
    zustandStore.subscribe(() => {
      callback(zustandStore.getState().stickers);
    });
  }

  public setStickers(stickers: StickerDataType[]) {
    zustandStore.setState({ stickers });
  }

  public getStickers(): StickerDataType[] {
    return zustandStore.getState().stickers;
  }
}

export default new StickersStore();
