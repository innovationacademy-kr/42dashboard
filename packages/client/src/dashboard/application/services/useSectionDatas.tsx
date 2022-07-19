import { useState } from 'react';
import SectionDatasService from '../../domain/sectionDatas/sectionData.service';
import SectionDataType from '../../domain/sectionDatas/sectionData.type';
import sectionDatasRepository from '../../infrastructure/sectionDatas.repository';
import sectionDatasStore from '../../infrastructure/store/sectionDatas.store';

const sectionDatassService = new SectionDatasService(sectionDatasRepository);

function useSectionDatass() {
  const [sectionDatas, setSectionDatas] = useState(
    sectionDatasStore.getSectionDatas(),
  );

  sectionDatasStore.subscribeToSectionDatas(
    (newsectionDatas: Array<SectionDataType>) => {
      setSectionDatas(newsectionDatas);
    },
  );

  const addSectionData = async (sectionDatas: SectionDataType) => {
    return await sectionDatassService.addSectionData(sectionDatas);
  };

  const removeSectionData = async (id: string) => {
    return await sectionDatassService.removeSectionData(id);
  };

  return { sectionDatas, addSectionData, removeSectionData };
}

export default useSectionDatass;
