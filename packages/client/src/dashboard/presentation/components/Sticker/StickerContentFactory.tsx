import PieChart from '../Charts/PieChart';
import {
  StickerContentPropType,
  StickerContentType,
} from './StickerContent.type';
import LineChart from '../Charts/LineChart';
import BarChart from '../Charts/BarChart';

export interface StickerContentFactoryProps {
  type: StickerContentType;
  contentProps: StickerContentPropType;
}

function StickerContentFactory(props: StickerContentFactoryProps) {
  const { type, contentProps } = props;
  switch (type) {
    case 'pieChart':
      return <PieChart {...contentProps} />;
    case 'lineChart':
      return <LineChart {...contentProps} />;
    case 'barChart':
      return <BarChart {...contentProps} />;
    case 'text':
      return <div>개발 중</div>;
    case 'table':
      return <div>개발 중</div>;
    default:
      return <div>개발 중</div>;
  }
}

export default StickerContentFactory;
