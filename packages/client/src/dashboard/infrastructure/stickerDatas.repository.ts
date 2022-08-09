import StickersDatasRepositoryInterface from '../domain/stickerDatas/stickerDatas.repository.interface';
import StickerDataType from '../domain/stickerDatas/stickerData.type';
import stickerDatasStore from './store/stickerDatas.store';
import { StickerContentFactoryProps } from '../presentation/components/Sticker/StickerContentFactory';

class StickerDatasRepository implements StickersDatasRepositoryInterface {
  public getStickerData(id: string) {
    const stickerDatas = stickerDatasStore.getStickerDatas();
    return stickerDatas.find(
      (stickerData) => stickerData.id === id,
    ) as StickerDataType;
  }

  public async addStickerData(newStickerData: StickerDataType) {
    const stickerDatas = [
      ...stickerDatasStore.getStickerDatas(),
      newStickerData,
    ];
    stickerDatasStore.setStickerDatas(stickerDatas);
  }

  public async updateStickerData(
    id: string,
    newStickerData: StickerContentFactoryProps,
  ) {
    const restStickerDatas = stickerDatasStore
      .getStickerDatas()
      .filter((stickerData) => stickerData.id !== id);
    const targetStickerData = this.getStickerData(id);
    targetStickerData.data = newStickerData;
    stickerDatasStore.setStickerDatas([...restStickerDatas, targetStickerData]);
  }

  public async removeStickerData(id: string) {
    const stickerDatas = stickerDatasStore

      .getStickerDatas()
      .filter((stickerData) => stickerData.id !== id);
    stickerDatasStore.setStickerDatas(stickerDatas);
  }
}

export default new StickerDatasRepository();
