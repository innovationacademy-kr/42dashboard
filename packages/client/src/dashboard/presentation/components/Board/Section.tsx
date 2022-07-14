import { useState } from 'react';
import './styles.css';
import './styles2.css';
import RGL, { Layout, WidthProvider } from 'react-grid-layout';
import { Header } from '../Common/Header';
import Sticker from '../Sticker/Sticker';
import useStickers from '../../../application/services/useStickers';
import { Button } from '@mui/material';
import { v4 as uuid } from 'uuid';
import StickerDataType from '../../../domain/stickers/stickers.type';
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

const ReactGridLayout = WidthProvider(RGL.Responsive);

export default function Section(props: SectionProps) {
  const { stickers, addSticker } = useStickers();

  console.log(stickers);
  return (
    <>
      <Button onClick={() => addSticker(stickerData)}>Add Sticker</Button>
      {stickers.map((sticker) => (
        <Sticker key={sticker.id} />
      ))}
    </>
  );
}
interface SectionProps {
  itemKey?: string;
  layout?: Layout[];
  clickHandlerGenerator?: (itemKey: string) => () => void;
  onStickerLayoutChange?: (stickerLayout: Layout[], itemKey: string) => void;
}

// export default function Section(props: SectionProps) {
//   const { itemKey = '', clickHandlerGenerator } = props;
//   const [layout, setLayout] = useState(props.layout || []);

//   function generateSticker() {
//     return layout.map((item: Layout) => {
//       return (
//         <div key={item.i}>
//           {<Sticker content="Table" clickHandler={removeSticker(item.i)} />}
//         </div>
//       );
//     });
//   }

//   function onLayoutChange(newLayout: Layout[]) {
//     setLayout(newLayout);
//     if (props.onStickerLayoutChange) {
//       props.onStickerLayoutChange(newLayout, props.itemKey);
//     }
//   }

//   function addSticker() {
//     setLayout([
//       ...layout,
//       {
//         i: `sticker-${Date.now().toString()}`,
//         x: (layout.length * 2) % 12,
//         y: Infinity,
//         w: 2,
//         h: 10,
//       },
//     ]);
//   }

//   function removeSticker(itemKey: string) {
//     return () => {
//       setLayout([...layout.filter((item: Layout) => item.i !== itemKey)]);
//     };
//   }

//   return (
//     <>
//       <button onClick={addSticker}>Add Sticker</button>
//       <Header
//         parentComponent={'SECTION'}
//         clickHandler={clickHandlerGenerator(itemKey)}
//       ></Header>
//       <ReactGridLayout
//         onDragStart={(a, b, c, d, e) => e.stopPropagation()}
//         layouts={{ lg: layout }}
//         breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
//         cols={{ lg: 5, md: 4, sm: 3, xs: 2, xxs: 1 }}
//         onLayoutChange={onLayoutChange}
//         className="layout"
//         rowHeight={30}
//       >
//         {generateSticker()}
//       </ReactGridLayout>
//     </>
//   );
// }
