import StickersRepositoryInterface from '../domain/stickerDatas/stickerDatas.repository.interface';
import StickerDataType from '../domain/stickerDatas/stickerData.type';
import stickerDatasStore from './store/stickerDatas.store';

class StickerDatasRepository implements StickersRepositoryInterface {
  public getSticker(id: string) {
    const stickerDatas = stickerDatasStore.getStickerDatas();
    return stickerDatas.find(
      (stickerData) => stickerData.id === id,
    ) as StickerDataType;
  }

  public async addSticker(stickerData: StickerDataType) {
    const stickerDatas = [...stickerDatasStore.getStickerDatas(), stickerData];
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
