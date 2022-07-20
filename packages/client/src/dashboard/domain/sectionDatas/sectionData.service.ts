import SectionDataType from './sectionData.type';
import SectionsRepositoryInterface from './sectionDatas.repository.interface';

class SectionDatasService {
  constructor(protected sectionDatasRepository: SectionsRepositoryInterface) {}

  public async addSectionData(sectionData: SectionDataType): Promise<void> {
    return this.sectionDatasRepository.addSection(sectionData);
  }

  public updateSectionData(sectionData: SectionDataType) {
    return this.sectionDatasRepository.updateSectionData(sectionData);
  }
  public async removeSectionData(id: string): Promise<void> {
    return this.sectionDatasRepository.removeSection(id);
  }
}

export default SectionDatasService;
