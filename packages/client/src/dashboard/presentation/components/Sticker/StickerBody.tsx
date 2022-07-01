import styled from '@emotion/styled';
import PieChart from '../Charts/PieChart';

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
const contentSwitch = (type: contentType) => {
  switch (type) {
    case 'Table':
      break;
    case 'PieChart':
      return <PieChart></PieChart>;
    case 'BarChart':
      break;
    case 'LineChart':
      break;
    default:
      break;
  }
};

export const StickerBody = (props: StickerBodyProps) => {
  const { content } = props;
  return <Content>{contentSwitch(content)}</Content>;
};
