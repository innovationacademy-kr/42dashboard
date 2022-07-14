import { StickerDataType } from './stickers.type';
import StickersRepositoryInterface from './stickers.repository.interface';

class StickersService {
  constructor(protected stickersRepository: StickersRepositoryInterface) {}

  public getSticker(id: string): StickerDataType {
    return this.stickersRepository.getSticker(id);
  }

  public async addSticker(sticker: StickerDataType): Promise<void> {
    return this.stickersRepository.addSticker(sticker);
  }

  public async removeSticker(id: string): Promise<void> {
    return this.stickersRepository.removeSticker(id);
  }
}

export default StickersService;
