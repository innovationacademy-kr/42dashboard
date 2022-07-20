import SectionDataType from './sectionData.type';

interface SectionDataRepositoryInterface {
  addSection: (section: SectionDataType) => void;
  removeSection: (id: string) => void;
  updateSectionData: (sectionData: SectionDataType) => void;
}

export default SectionDataRepositoryInterface;
