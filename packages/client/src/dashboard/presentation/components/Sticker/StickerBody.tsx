import { useElementSize } from 'usehooks-ts';
import styled from '@emotion/styled';
import PieChart from '../Charts/PieChart';
import LineChart from '../Charts/LineChart';
import BarChart from '../Charts/BarChart';
import StickyTable from '../Table/Table';

type contentType = 'Table' | 'PieChart' | 'BarChart' | 'LineChart';

interface StickerBodyProps {
  content: contentType;
  dataSet?: any;
  colorSet?: any;
}

const Content = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100% - 3rem);
  width: calc(100% - 1rem);
  padding: 0.5rem;
`;

// TODO(hybae)
// Support other charts and table with dataset in Content component
const contentSwitch = (type: contentType, height: number) => {
  switch (type) {
    case 'Table':
      return <StickyTable height={height} />;
    case 'PieChart':
      return <PieChart />;
    case 'BarChart':
      return <BarChart />;
    case 'LineChart':
      return <LineChart />;
    default:
      break;
  }
};

export const StickerBody = (props: StickerBodyProps) => {
  const { content } = props;
  const [squareRef, { height }] = useElementSize();
  return <Content ref={squareRef}>{contentSwitch(content, height)}</Content>;
};
