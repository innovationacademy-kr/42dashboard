import { useState } from 'react';
import SectionDatasService from '../../domain/sectionDatas/sectionData.service';
import SectionDataType from '../../domain/sectionDatas/sectionData.type';
import sectionDatasRepository from '../../infrastructure/sectionDatas.repository';
import sectionDatasStore from '../../infrastructure/store/sectionDatas.store';
import { Layout } from 'react-grid-layout';
import stickerDatasStore from '../../infrastructure/store/stickerDatas.store';

const sectionDatasService = new SectionDatasService(sectionDatasRepository);

function useSections() {
  const [sectionDatas, setSectionDatas] = useState(
    sectionDatasStore.getSectionDatas(),
  );

  sectionDatasStore.subscribeToSectionDatas(
    (newsectionDatas: Array<SectionDataType>) => {
      setSectionDatas(newsectionDatas);
    },
  );

  const addSectionData = (sectionDatas: SectionDataType) => {
    return sectionDatasService.addSectionData(sectionDatas);
  };

  const removeSectionData = (id: string) => {
    //stickerDatas 에서 해당 section 의 sticker 들을 삭제하는 작업
    const sectionData = sectionDatasStore.getSectionDataById(id);
    if (!sectionData) return;
    const stickers = stickerDatasStore
      .getStickerDatas()
      .filter(
        (sticker) => sectionData.stickerIds.includes(sticker.id) === false,
      );
    stickerDatasStore.setStickerDatas(stickers);

    return sectionDatasService.removeSectionData(id);
  };

  const handleStickerAdd = (sectionId: string, stickerId: string) => {
    const currentSection = sectionDatasStore.getSectionDataById(sectionId);
    if (!currentSection) return;

    const newLayouts = [
      ...currentSection.stickerLayouts,
      {
        i: stickerId,
        x: (currentSection.stickerLayouts.length * 2) % 12,
        y: Infinity,
        w: 5,
        h: 5,
      },
    ];
    currentSection.stickerIds.push(stickerId);
    currentSection.stickerLayouts = newLayouts;
    sectionDatasService.updateSectionData(currentSection);
  };

  const handleStickerRemove = (sectionId: string, stickerId: string) => {
    const currentSection = sectionDatasStore.getSectionDataById(sectionId);
    if (!currentSection) return;

    const stickerIndex = currentSection.stickerIds.indexOf(stickerId);
    if (stickerIndex === -1) return;

    currentSection.stickerIds.splice(stickerIndex, 1);
    currentSection.stickerLayouts.splice(stickerIndex, 1);
    sectionDatasService.updateSectionData(currentSection);
  };

  const handleStickerLayoutChange = (
    sectionId: string,
    newLayout: Array<Layout>,
  ) => {
    const currentSection = sectionDatasStore.getSectionDataById(sectionId);
    if (!currentSection) return;

    currentSection.stickerLayouts = newLayout;
    sectionDatasService.updateSectionData(currentSection);
  };

  const getSectionDatas = (id: string) => {
    return sectionDatasStore.getSectionDataById(id);
  };

  return {
    sectionDatas,
    addSectionData,
    removeSectionData,
    getSectionDatas,
    handleStickerAdd,
    handleStickerRemove,
    handleStickerLayoutChange,
  };
}

export default useSections;
