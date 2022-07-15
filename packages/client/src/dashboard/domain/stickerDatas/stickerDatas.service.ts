import StickerDataType from './stickerData.type';
import StickersRepositoryInterface from './stickerDatas.repository.interface';

class StickersService {
  constructor(protected stickerDatasRepository: StickersRepositoryInterface) {}

  public async getSticker(id: string): Promise<StickerDataType> {
    return this.stickerDatasRepository.getSticker(id);
  }

  public async addSticker(sticker: StickerDataType): Promise<void> {
    return this.stickerDatasRepository.addSticker(sticker);
  }

  public async removeSticker(id: string): Promise<void> {
    return this.stickerDatasRepository.removeSticker(id);
  }
}

export default StickersService;
