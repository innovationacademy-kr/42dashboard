import PieChart from '../Charts/PieChart';
import {
  StickerContentPropType,
  StickerContentType,
} from './StickerContent.type';
import LineChart from '../Charts/LineChart';
import BarChart from '../Charts/BarChart';
import styled from '@emotion/styled';
import useMode from '../../../application/services/useMode';
export interface StickerContentFactoryProps {
  type: StickerContentType;
  contentProps: StickerContentPropType;
}

const StickerContentWrapper = styled.div`
  position: relative;
  margin-left: auto;
  margin-right: auto;
  align-items: center;
  height: calc(100% - 3rem);
  width: calc(100% - 1rem);
  top: 1rem;
  &.edit {
    top: 0rem;
  }
`;

function StickerContentFactory(props: StickerContentFactoryProps) {
  const { type, contentProps } = props;
  const { getControlMode } = useMode();
  const mode = getControlMode();

  switch (type) {
    case 'pieChart':
      return (
        <StickerContentWrapper className={mode}>
          <PieChart {...contentProps} />
        </StickerContentWrapper>
      );
    case 'lineChart':
      return (
        <StickerContentWrapper className={mode}>
          <LineChart {...contentProps} />
        </StickerContentWrapper>
      );
    case 'barChart':
      return (
        <StickerContentWrapper className={mode}>
          <BarChart {...contentProps} />
        </StickerContentWrapper>
      );
    case 'text':
      return (
        <StickerContentWrapper className={mode}>
          <div>개발 중</div>
        </StickerContentWrapper>
      );
    case 'table':
      return (
        <StickerContentWrapper className={mode}>
          <div>개발 중</div>
        </StickerContentWrapper>
      );
    default:
      return (
        <StickerContentWrapper className={mode}>
          <div>개발 중</div>
        </StickerContentWrapper>
      );
  }
}

export default StickerContentFactory;
