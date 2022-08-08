import { Layout } from 'react-grid-layout';

interface SectionDataType {
  id: string;
  startDate?: string;
  endDate?: string;
  grade?: string;
  stickerIds: string[];
  stickerLayouts: Layout[];
}

export default SectionDataType;
