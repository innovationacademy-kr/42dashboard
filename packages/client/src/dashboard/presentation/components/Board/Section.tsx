import { useState } from 'react';
import './styles.css';
import './styles2.css';
import RGL, { Layout, WidthProvider } from 'react-grid-layout';
import { Header } from '../Common/Header';
import { Sticker } from '../Sticker/Sticker';
import * as filter from '../QueryFilter/QueryFilter';

const ReactGridLayout = WidthProvider(RGL.Responsive);

interface SectionProps {
  itemKey: string;
  layout: Layout[];
  clickHandlerGenerator: (itemKey: string) => () => void;
  onStickerLayoutChange: (stickerLayout: Layout[], itemKey: string) => void;
}

export default function Section(props: SectionProps) {
  const { itemKey = '', clickHandlerGenerator } = props;
  const [layout, setLayout] = useState(props.layout || []);

  function generateSticker() {
    return [
      <div key={1}>
        <Sticker
          content="PieChart"
          query={filter.GENDER}
          filters={{ man: filter.Man, woman: filter.Woman }}
          clickHandler={removeSticker('1')}
        />
      </div>,
      <div key={2}>
        <Sticker
          content="PieChart"
          query={filter.EMPLOYMENT}
          filters={{
            employed: filter.Employed,
            unemployed: filter.Unemployed,
          }}
          clickHandler={removeSticker('2')}
        />
      </div>,
      <div key={3}>
        <Sticker
          content="BarChart"
          query={filter.COALITION}
          filters={{
            gun: filter.Gun,
            gon: filter.Gon,
            gam: filter.Gam,
            lee: filter.Lee,
          }}
          clickHandler={removeSticker('3')}
        />
      </div>,
      <div key={4}>
        <Sticker
          content="LineChart"
          query={filter.GRADE}
          filters={{
            one: filter.One,
            two: filter.Two,
            three: filter.Three,
            four: filter.Four,
          }}
          clickHandler={removeSticker('3')}
        />
      </div>,
      <div key={5}>
        <Sticker
          content="Table"
          query={filter.USERS}
          filters={{
            user: filter.Grade3,
          }}
          clickHandler={removeSticker('3')}
        />
      </div>,
    ];
    // return layout.map((item: Layout) => {
    //   return (
    //     <div key={item.i}>
    //       {<Sticker content="Table" clickHandler={removeSticker(item.i)} />}
    //     </div>
    //   );
    // });
  }

  function onLayoutChange(newLayout: Layout[]) {
    setLayout(newLayout);
    if (props.onStickerLayoutChange) {
      props.onStickerLayoutChange(newLayout, props.itemKey);
    }
  }

  function addSticker() {
    setLayout([
      ...layout,
      {
        i: `sticker-${Date.now().toString()}`,
        x: (layout.length * 2) % 12,
        y: Infinity,
        w: 2,
        h: 10,
      },
    ]);
  }

  function removeSticker(itemKey: string) {
    return () => {
      setLayout([...layout.filter((item: Layout) => item.i !== itemKey)]);
    };
  }

  return (
    <>
      <button onClick={addSticker}>Add Sticker</button>
      <Header
        parentComponent={'SECTION'}
        clickHandler={clickHandlerGenerator(itemKey)}
      ></Header>
      <ReactGridLayout
        onDragStart={(a, b, c, d, e) => e.stopPropagation()}
        layouts={{ lg: layout }}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 5, md: 4, sm: 3, xs: 2, xxs: 1 }}
        onLayoutChange={onLayoutChange}
        className="layout"
        rowHeight={30}
      >
        {generateSticker()}
      </ReactGridLayout>
    </>
  );
}
