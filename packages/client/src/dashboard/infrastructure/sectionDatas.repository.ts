import SectionDataType from '../domain/sectionDatas/sectionData.type';
import SectionDataRepositoryInterface from '../domain/sectionDatas/sectionDatas.repository.interface';
import sectionDatasStore from './store/sectionDatas.store';

class SectionDatasRepository implements SectionDataRepositoryInterface {
  public async addSection(sectionData: SectionDataType) {
    const sectionDatas = [...sectionDatasStore.getSectionDatas(), sectionData];
    sectionDatasStore.setSectionDatas(sectionDatas);
  }

  public updateSectionData(sectionData: SectionDataType) {
    const sectionDatas = sectionDatasStore
      .getSectionDatas()
      .filter((value) => value.id !== sectionData.id);
    sectionDatas.push(sectionData);
    sectionDatasStore.setSectionDatas(sectionDatas);
  }

  public async removeSection(id: string) {
    const sectionDatas = sectionDatasStore
      .getSectionDatas()
      .filter((sectionData) => sectionData.id !== id);
    sectionDatasStore.setSectionDatas(sectionDatas);
  }
}

export default new SectionDatasRepository();
