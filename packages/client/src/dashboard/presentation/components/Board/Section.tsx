import { useState } from 'react';
import './styles.css';
import './styles2.css';
import RGL, { Layout, WidthProvider } from 'react-grid-layout';

const ReactGridLayout = WidthProvider(RGL.Responsive);

export default function Section(props: any) {
  const { itemKey = '' } = props;
  const [count, setCount] = useState(0);
  const [layout, setLayout] = useState(props.layout || []);

  function generateSticker() {
    return layout.map((item: Layout) => {
      return <div key={item.i}>{<span className="text">{item.i}</span>}</div>;
    });
  }

  function onLayoutChange(newLayout: Layout[]) {
    setLayout(newLayout);
    if (props.onStickerLayoutChange) {
      props.onStickerLayoutChange(newLayout, props.itemKey);
    }
  }

  function addSticker() {
    setCount(count + 1);
    setLayout([
      ...layout,
      {
        i: `sticker-${count}-${itemKey}`,
        x: (layout.length * 2) % 12,
        y: Infinity,
        w: 2,
        h: 2,
      },
    ]);
  }

  return (
    <>
      <button onClick={addSticker}>Add Sticker</button>
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
