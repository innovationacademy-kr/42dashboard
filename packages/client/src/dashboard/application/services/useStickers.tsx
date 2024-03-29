import { useState } from 'react';
import StickersService from '../../domain/stickerDatas/stickerDatas.service';
import StickerDataType from '../../domain/stickerDatas/stickerData.type';
import stickerDatasRepository from '../../infrastructure/stickerDatas.repository';
import stickersStore from '../../infrastructure/store/stickerDatas.store';
import { StickerContentFactoryProps } from '../../presentation/components/Sticker/StickerContentFactory';

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

  const updateStickerDatas = (stickerDatas: Array<StickerDataType>) => {
    stickersStore.setStickerDatas(stickerDatas);
  };

  const addStickerData = async (newSticker: StickerDataType) => {
    return await stickersService.addStickerData(newSticker);
  };

  const updateStickerData = async (
    stickerId: string,
    newStickerData: StickerContentFactoryProps,
  ) => {
    return await stickersService.updateStickerData(stickerId, newStickerData);
  };

  const removeSticker = async (id: string) => {
    return await stickersService.removeStickerData(id);
  };

  return {
    stickerDatas,
    getSticker,
    addStickerData,
    updateStickerData,
    updateStickerDatas,
    removeSticker,
  };
}

export default useStickers;
