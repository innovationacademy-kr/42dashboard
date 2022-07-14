import { useEffect, useState } from 'react';
import { Layout } from 'react-grid-layout';
import { v4 as uuid } from 'uuid';

interface NestedLayout extends Layout {
  sticker: Layout[];
}

function useBoardLayout() {
  const [layout, setLayout] = useState(Array<NestedLayout>);

  useEffect(() => {
    window.dispatchEvent(new Event('resize'));
  }, [layout]);

  const handleStickerLayoutChange = (
    stickerLayout: Layout[],
    itemKey: string,
  ) => {
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
  };

  const handleSectionLayoutChange = (newLayout: Array<NestedLayout>) => {
    setLayout(newLayout);
  };

  const handleSectionAdd = () => {
    setLayout([
      ...layout,
      {
        i: uuid(),
        x: (layout.length * 2) % 12,
        y: Infinity,
        w: 5,
        h: 5,
        sticker: new Array<Layout>(),
      },
    ]);
  };

  const handleSectionRemove = (itemKey: string) => {
    return () => {
      setLayout([...layout.filter((item: NestedLayout) => item.i !== itemKey)]);
    };
  };

  return {
    layout,
    handleStickerLayoutChange,
    handleSectionLayoutChange,
    handleSectionAdd,
    handleSectionRemove,
  };
}

export default useBoardLayout;
