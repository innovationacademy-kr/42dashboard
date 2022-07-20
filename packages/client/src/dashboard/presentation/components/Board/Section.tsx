import './styles.css';
import './styles2.css';
import Sticker from '../Sticker/Sticker';
import useStickers from '../../../application/services/useStickers';
import { Button } from '@mui/material';
import { v4 as uuid } from 'uuid';
import StickerDataType from '../../../domain/stickerDatas/stickerData.type';
import createQuery from '../../../infrastructure/http/graphql/createQuery';
import RGL, { Layout, WidthProvider } from 'react-grid-layout';

const ReactGridLayout = WidthProvider(RGL.Responsive);

const weMadeQuery = createQuery(
  ['filtersGrade', 'filtersMan', 'filtersWoman'],
  ['man', 'woman'],
  [
    ['filtersGrade', 'filtersMan'],
    ['filtersGrade', 'filtersWoman'],
    ['filtersMan'],
    ['filtersWoman'],
  ],
);
const queryData = {
  query: weMadeQuery,
  filters: {
    filtersMan: {
      entityName: 'userPersonalInformation',
      column: 'gender',
      operator: '=',
      givenValue: '남',
      latest: true,
    },
    filtersWoman: {
      entityName: 'userPersonalInformation',
      column: 'gender',
      operator: '=',
      givenValue: '여',
      latest: true,
    },
    filtersGrade: {
      entityName: 'user',
      column: 'grade',
      operator: '=',
      givenValue: '2기',
      latest: true,
    },
  },
};

interface SectionProps {
  id: string;
  stickerLayouts: Layout[];
  handleSectionRemove: (sectionId: string) => void;
  handleStickerAdd: (sectionId: string, stickerId: string) => void;
  handleStickerRemove: (sectionId: string, stickerId: string) => void;
  handleStickerLayoutChange: (sectionId: string, newLayout: Layout[]) => void;
}

export default function Section(props: SectionProps) {
  const { addSticker, removeSticker } = useStickers();
  const {
    id,
    stickerLayouts,
    handleSectionRemove,
    handleStickerAdd,
    handleStickerLayoutChange,
    handleStickerRemove,
  } = props;

  const stickerData: StickerDataType = {
    id: uuid(),
    sectionId: 'section-1',
    data: {
      type: 'pieChart',
      contentProps: {
        labels: ['man', 'woman'],
        queryData,
        options: {},
      },
    },
  };

  function drawStickers() {
    return stickerLayouts.map((sticker: Layout) => (
      <div key={sticker.i}>
        <Sticker
          id={sticker.i}
          data={stickerData.data}
          handleStickerRemove={(stickerId) => {
            removeSticker(stickerId);
            handleStickerRemove(id, stickerId);
          }}
        />
      </div>
    ));
  }

  return (
    <>
      <Button
        onClick={() => {
          addSticker(stickerData);
          handleStickerAdd(id, stickerData.id);
        }}
      >
        Add Sticker
      </Button>
      <Button
        onClick={() => {
          handleSectionRemove(id);
        }}
      >
        Remove Section
      </Button>
      <ReactGridLayout
        onDragStart={(a, b, c, d, e) => e.stopPropagation()}
        layouts={{ lg: stickerLayouts }}
        breakpoints={{ lg: 600, md: 498, sm: 384, xs: 240, xxs: 0 }}
        cols={{ lg: 8, md: 5, sm: 4, xs: 2, xxs: 1 }}
        onLayoutChange={(newLayout) => {
          handleStickerLayoutChange(id, newLayout);
        }}
        className="layout"
        rowHeight={30}
      >
        {drawStickers()}
      </ReactGridLayout>
    </>
  );
}
