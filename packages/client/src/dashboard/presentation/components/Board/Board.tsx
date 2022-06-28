import { useState, useEffect } from 'react';
import './styles.css';
import './styles2.css';
import RGL, { WidthProvider } from 'react-grid-layout';
import Section from '../Section/Section';

const ReactGridLayout = WidthProvider(RGL);

export default function Board(props: any) {
  const { itemKey = '' } = props;
  const [count, setCount] = useState(0);
  const [layout, setLayout] = useState(props.layout || []);

  function generateSection() {
    return layout.map((item: any) => {
      return (
        <div key={item.i}>
          {item.i.startsWith('section-') && (
            <Section
              layout={item.layout}
              itemKey={item.i}
              onStickerLayoutChange={onStickerLayoutChange}
            />
          )}
        </div>
      );
    });
  }

  // when add section or move
  function onSectionLayoutChange(newLayout: any) {
    setLayout(newLayout);
  }

  // change nested layout
  function onStickerLayoutChange(stickerLayout: any, itemKey: any) {
    const itemIndex = layout.findIndex((item: any) => item.i === itemKey);
    if (itemIndex !== -1) {
      setLayout([
        ...layout.slice(0, itemIndex),
        {
          ...layout[itemIndex],
          layout: stickerLayout,
        },
        ...layout.slice(itemIndex + 1),
      ]);
    }
  }

  function addSection() {
    setCount(count + 1);
    setLayout([
      ...layout,
      {
        i: `section-${count}`,
        x: (layout.length * 2) % 12,
        y: Infinity,
        w: 5,
        h: 5,
        layout: [],
      },
    ]);
  }

  // 화면 리사이즈(반응형) 하면 자리를 잘 찾아감.-> 레이아웃 변경때마다 화면 리사이즈 효과를 넣어주면 되겠다.
  useEffect(() => {
    console.log({ layout });
  }, [layout]);

  return (
    <>
      <button onClick={addSection}>Add Section Item</button>
      <ReactGridLayout
        onDragStart={(a, b, c, d, e) => e.stopPropagation()}
        layout={layout}
        onLayoutChange={onSectionLayoutChange}
        className="layout"
        rowHeight={30} // rowHeight는 각 셀의 높이, but changable.
        cols={12} //num of cols
      >
        {generateSection()}
      </ReactGridLayout>
    </>
  );
}
