import { Layout } from 'react-grid-layout';

export interface PeriodFilterType {
  startDate?: Date;
  endDate?: Date;
  grade?: string;
}
interface SectionDataType {
  id: string;
  periodFilter: PeriodFilterType;
  stickerIds: string[];
  stickerLayouts: Layout[];
}

export default SectionDataType;
