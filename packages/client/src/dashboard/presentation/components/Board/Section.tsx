import './styles.css';
import './styles2.css';
import Sticker from '../Sticker/Sticker';
import useStickers from '../../../application/services/useStickers';
import { Button } from '@mui/material';
import { v4 as uuid } from 'uuid';
import StickerDataType from '../../../domain/stickerDatas/stickerData.type';
import createQuery from '../../../infrastructure/http/graphql/createQuery';
import useSectionLayout from '../../../application/services/useSectionLayout';
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

export default function Section() {
  // const { stickerDatas, addSticker, removeSticker } = useStickers();
  const {
    stickerLayout,
    handleStickerAdd,
    handleStickerLayoutChange,
    handleStickerRemove,
  } = useSectionLayout();

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
    // layout length
    console.log(stickerLayout.length);
    return stickerLayout.map((sticker: Layout, idx: number) => (
      <div key={sticker.i}>
        <Sticker
          id={sticker.i}
          data={stickerData.data}
          handleStickerRemove={handleStickerRemove}
        />
      </div>
    ));
  }

  return (
    <>
      <Button onClick={handleStickerAdd}>Add Sticker</Button>
      <ReactGridLayout
        onDragStart={(a, b, c, d, e) => e.stopPropagation()}
        layouts={{ lg: stickerLayout }}
        breakpoints={{ lg: 600, md: 498, sm: 384, xs: 240, xxs: 0 }}
        cols={{ lg: 8, md: 5, sm: 4, xs: 2, xxs: 1 }}
        onLayoutChange={handleStickerLayoutChange}
        className="layout"
        rowHeight={30}
      >
        {drawStickers()}
      </ReactGridLayout>
    </>
  );
}
