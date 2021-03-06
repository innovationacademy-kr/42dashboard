import StickerDataType from './stickerData.type';
import StickersRepositoryInterface from './stickerDatas.repository.interface';

class StickerDatasService {
  constructor(protected stickerDatasRepository: StickersRepositoryInterface) {}

  public async getStickerData(id: string): Promise<StickerDataType> {
    return this.stickerDatasRepository.getStickerData(id);
  }

  public async addStickerData(newStickerData: StickerDataType): Promise<void> {
    return this.stickerDatasRepository.addStickerData(newStickerData);
  }

  public async removeStickerData(id: string): Promise<void> {
    return this.stickerDatasRepository.removeStickerData(id);
  }
}

export default StickerDatasService;
