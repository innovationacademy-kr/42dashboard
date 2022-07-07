import { useElementSize } from 'usehooks-ts';
import styled from '@emotion/styled';
import PieChart from '../Charts/PieChart';
import LineChart from '../Charts/LineChart';
import BarChart from '../Charts/BarChart';
import StickyTable from '../Table/Table';
import { DocumentNode } from '@apollo/client';

type contentType = 'Table' | 'PieChart' | 'BarChart' | 'LineChart';

interface StickerBodyProps {
  content: contentType;
  query: DocumentNode;
  filters: object;
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
const contentSwitch = (
  type: contentType,
  height: number,
  query: DocumentNode,
  filters: object,
) => {
  switch (type) {
    case 'Table':
      return <StickyTable height={height} query={query} filters={filters} />;
    case 'PieChart':
      return <PieChart query={query} filters={filters} />;
    case 'BarChart':
      return <BarChart query={query} filters={filters} />;
    case 'LineChart':
      return <LineChart query={query} filters={filters} />;
    default:
      break;
  }
};

export const StickerBody = (props: StickerBodyProps) => {
  const { content, query, filters } = props;
  const [squareRef, { height }] = useElementSize();

  return (
    <Content ref={squareRef}>
      {contentSwitch(content, height, query, filters)}
    </Content>
  );
};
