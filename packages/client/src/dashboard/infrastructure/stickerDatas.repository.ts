import StickersDatasRepositoryInterface from '../domain/stickerDatas/stickerDatas.repository.interface';
import StickerDataType from '../domain/stickerDatas/stickerData.type';
import stickerDatasStore from './store/stickerDatas.store';

class StickerDatasRepository implements StickersDatasRepositoryInterface {
  public getSticker(id: string) {
    const stickerDatas = stickerDatasStore.getStickerDatas();
    return stickerDatas.find(
      (stickerData) => stickerData.id === id,
    ) as StickerDataType;
  }

  public async addSticker(newStickerData: StickerDataType) {
    const stickerDatas = [
      ...stickerDatasStore.getStickerDatas(),
      newStickerData,
    ];
    stickerDatasStore.setStickerDatas(stickerDatas);
  }

  public async removeSticker(id: string) {
    const stickerDatas = stickerDatasStore

      .getStickerDatas()
      .filter((stickerData) => stickerData.id !== id);
    stickerDatasStore.setStickerDatas(stickerDatas);
  }
}

export default new StickerDatasRepository();
