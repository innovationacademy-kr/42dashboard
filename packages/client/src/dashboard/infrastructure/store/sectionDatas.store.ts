import zustandStore from './zustand/dashboard.store.zustand';
import SectionDataType from '../../domain/sectionDatas/sectionData.type';

// ===================== ZUSTAND STORAGE =====================
class SectionDatasStore {
  public subscribeToSectionDatas(
    callback: (sectionDatas: SectionDataType[]) => void,
  ) {
    zustandStore.subscribe(() => {
      callback(zustandStore.getState().sectionDatas);
    });
  }

  public setSectionDatas(sectionDatas: SectionDataType[]) {
    zustandStore.setState({ sectionDatas });
  }

  public getSectionDatas(): SectionDataType[] {
    return zustandStore.getState().sectionDatas;
  }
}

export default new SectionDatasStore();
