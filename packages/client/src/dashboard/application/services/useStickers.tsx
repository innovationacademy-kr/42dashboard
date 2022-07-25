import { useState } from 'react';
import StickersService from '../../domain/stickerDatas/stickerDatas.service';
import StickerDataType from '../../domain/stickerDatas/stickerData.type';
import stickerDatasRepository from '../../infrastructure/stickerDatas.repository';
import stickersStore from '../../infrastructure/store/stickerDatas.store';

const stickersService = new StickersService(stickerDatasRepository);

function useStickers() {
  const [stickerDatas, setStickerDatas] = useState(
    stickersStore.getStickerDatas(),
  );

  console.log('stateStickers', stickerDatas);

  stickersStore.subscribeToStickers(
    (newStickerDatas: Array<StickerDataType>) => {
      setStickerDatas(newStickerDatas);
    },
  );

  const getSticker = (id: string) => {
    return stickersService.getSticker(id);
  };

  const addSticker = async (newSticker: StickerDataType) => {
    return await stickersService.addSticker(newSticker);
  };

  const removeSticker = async (id: string) => {
    return await stickersService.removeSticker(id);
  };

  return { stickerDatas, getSticker, addSticker, removeSticker };
}

export default useStickers;
