import StickerDataType from './stickerData.type';
import StickersRepositoryInterface from './stickerDatas.repository.interface';

class StickersService {
  constructor(protected stickerDatasRepository: StickersRepositoryInterface) {}

  public async getSticker(id: string): Promise<StickerDataType> {
    return this.stickerDatasRepository.getSticker(id);
  }

  public async addSticker(newStickerData: StickerDataType): Promise<void> {
    return this.stickerDatasRepository.addSticker(newStickerData);
  }

  public async removeSticker(id: string): Promise<void> {
    return this.stickerDatasRepository.removeSticker(id);
  }
}

export default StickersService;
