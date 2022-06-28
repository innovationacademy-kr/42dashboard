import { useState } from 'react';
import './styles.css';
import './styles2.css';
import RGL, { WidthProvider } from 'react-grid-layout';

const ReactGridLayout = WidthProvider(RGL);

export default function Section(props: any) {
  const { itemKey = '' } = props;
  const [count, setCount] = useState(0);
  const [layout, setLayout] = useState(props.layout || []);

  function generateSticker() {
    return layout.map((item: any) => {
      return (
        <div key={item.i}>
          {item.i.startsWith('sticker-') && (
            <span className="text">{item.i}</span>
          )}
        </div>
      );
    });
  }

  function onLayoutChange(newLayout: any) {
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
        layout={layout}
        onLayoutChange={onLayoutChange}
        className="layout"
        rowHeight={30}
        cols={12}
      >
        {generateSticker()}
      </ReactGridLayout>
    </>
  );
}
