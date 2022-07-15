import zustandStore from './zustand/dashboard.store.zustand';
import StickerDataType from '../../domain/stickerDatas/stickerData.type';

// ===================== ZUSTAND STORAGE =====================
class StickerDatasStore {
  public subscribeToStickers(
    callback: (stickerDatas: StickerDataType[]) => void,
  ) {
    zustandStore.subscribe(() => {
      callback(zustandStore.getState().stickerDatas);
    });
  }

  public setStickerDatas(stickerDatas: StickerDataType[]) {
    zustandStore.setState({ stickerDatas });
  }

  public getStickerDatas(): StickerDataType[] {
    return zustandStore.getState().stickerDatas;
  }
}

export default new StickerDatasStore();
