import './styles.css';
import './styles2.css';
import RGL, { WidthProvider } from 'react-grid-layout';
import Sticker from '../Sticker/Sticker';
import useStickers from '../../../application/services/useStickers';
import { Button } from '@mui/material';
import { v4 as uuid } from 'uuid';
import StickerDataType from '../../../domain/stickerDatas/stickerData.type';
import createQuery from '../../../infrastructure/http/graphql/createQuery';

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
  const { stickerDatas, addSticker, removeSticker } = useStickers();

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

  return (
    <>
      <Button onClick={() => addSticker(stickerData)}>Add Sticker</Button>
      {stickerDatas.map((sticker) => (
        <Sticker
          key={sticker.id}
          id={sticker.id}
          data={sticker.data}
          handleStickerRemove={removeSticker}
        />
      ))}
    </>
  );
}
