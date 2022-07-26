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

  stickersStore.subscribeToStickers(
    (newStickerDatas: Array<StickerDataType>) => {
      setStickerDatas(newStickerDatas);
    },
  );

  const getSticker = (id: string) => {
    return stickersService.getStickerData(id);
  };

  const addStickerData = async (newSticker: StickerDataType) => {
    return await stickersService.addStickerData(newSticker);
  };

  const removeSticker = async (id: string) => {
    return await stickersService.removeStickerData(id);
  };

  return { stickerDatas, getSticker, addStickerData, removeSticker };
}

export default useStickers;
