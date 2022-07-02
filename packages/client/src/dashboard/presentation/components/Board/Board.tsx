import { useState, useEffect } from 'react';
import './styles.css';
import './styles2.css';
import RGL, { Layout, WidthProvider } from 'react-grid-layout';
import Section from './Section';

const ReactGridLayout = WidthProvider(RGL.Responsive);
interface NestedLayout extends Layout {
  sticker: Layout[];
}

export default function Board() {
  const [layout, setLayout] = useState(Array<NestedLayout>);

  function generateSection() {
    return layout.map((item: NestedLayout) => {
      return (
        <div key={item.i}>
          <Section
            layout={item.sticker}
            itemKey={item.i}
            onStickerLayoutChange={onStickerLayoutChange}
            clickHandlerGenerator={removeSection}
          />
        </div>
      );
    });
  }

  // when add section or move
  function onSectionLayoutChange(newLayout: Array<NestedLayout>) {
    setLayout(newLayout);
  }
  // change nested layout
  function onStickerLayoutChange(stickerLayout: Layout[], itemKey: string) {
    const itemIndex = layout.findIndex(
      (item: NestedLayout) => item.i === itemKey,
    );
    if (itemIndex !== -1) {
      setLayout([
        ...layout.slice(0, itemIndex),
        {
          ...layout[itemIndex],
          sticker: stickerLayout,
        },
        ...layout.slice(itemIndex + 1),
      ]);
    }
  }

  function addSection() {
    setLayout([
      ...layout,
      {
        i: `section-${Date.now().toString()}`,
        x: (layout.length * 2) % 12,
        y: Infinity,
        w: 5,
        h: 5,
        sticker: new Array<Layout>(),
      },
    ]);
  }

  function removeSection(itemKey: string) {
    return () => {
      setLayout([...layout.filter((item: NestedLayout) => item.i !== itemKey)]);
    };
  }

  useEffect(() => {
    window.dispatchEvent(new Event('resize'));
  }, [layout]);

  return (
    <>
      <button onClick={addSection}>Add Section Item</button>
      <ReactGridLayout
        onDragStart={(a, b, c, d, e) => e.stopPropagation()}
        layouts={{ lg: layout }}
        breakpoints={{ lg: 600, md: 498, sm: 384, xs: 240, xxs: 0 }}
        cols={{ lg: 5, md: 4, sm: 3, xs: 2, xxs: 1 }}
        onLayoutChange={onSectionLayoutChange}
        className="layout"
        rowHeight={30} // rowHeight는 각 셀의 높이, but changable.
      >
        {generateSection()}
      </ReactGridLayout>
    </>
  );
}
