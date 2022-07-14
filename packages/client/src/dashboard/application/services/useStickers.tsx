import { useState } from 'react';
import StickersService from '../../domain/stickers/stickers.service';
import StickerDataType from '../../domain/stickers/stickers.type';
import stickersRepository from '../../infrastructure/stickers.repository';
import stickersStore from '../../infrastructure/store/stickers.store';

const stickersService = new StickersService(stickersRepository);

function useStickers() {
  const [stickers, setStickers] = useState(stickersStore.getStickers());

  stickersStore.subscribeToStickers((stickers: Array<StickerDataType>) => {
    setStickers(stickers);
  });

  const getSticker = (id: string) => {
    return stickersService.getSticker(id);
  };

  const addSticker = async (sticker: StickerDataType) => {
    return await stickersService.addSticker(sticker);
  };

  const removeSticker = async (id: string) => {
    return await stickersService.removeSticker(id);
  };

  return { stickers, getSticker, addSticker, removeSticker };
}

export default useStickers;
