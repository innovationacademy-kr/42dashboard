import { Chart, ChartType } from 'chart.js';
import { Layout } from 'react-grid-layout';
export default interface PresetType {
  id: string;
  title: string;
  description?: string;
  data: PresetDataType; //JSX raw string
}

interface PresetDataType {
  // sections: SectionDataType[];
  layouts: Layout[];
}

// interface SectionDataType {
//   id: string;
//   filters: FilterDataType[];
//   stickers: StickerDataType[];
//   layouts: LayoutDataType[];
// }

// interface StickerDataType {
//   id: string;
//   filters: FilterDataType[];
//   // content: ChartType | TableType;
// }
