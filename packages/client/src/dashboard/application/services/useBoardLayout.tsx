import { useEffect, useState } from 'react';
import { Layout } from 'react-grid-layout';
import { v4 as uuid } from 'uuid';

export interface NestedLayout extends Layout {
  stickers: Layout[];
}

function useBoardLayout() {
  const [sectionLayout, setSectionLayout] = useState(Array<NestedLayout>);

  useEffect(() => {
    window.dispatchEvent(new Event('resize'));
  }, [sectionLayout]);

  const handleStickerLayoutChange = (
    stickerLayout: Layout[],
    itemKey: string,
  ) => {
    const itemIndex = sectionLayout.findIndex(
      (item: NestedLayout) => item.i === itemKey,
    );
    if (itemIndex !== -1) {
      setSectionLayout([
        ...sectionLayout.slice(0, itemIndex),
        {
          ...sectionLayout[itemIndex],
          stickers: stickerLayout,
        },
        ...sectionLayout.slice(itemIndex + 1),
      ]);
    }
  };

  const handleSectionLayoutChange = (newLayout: Array<NestedLayout>) => {
    setSectionLayout(newLayout);
  };

  const handleSectionAdd = () => {
    setSectionLayout([
      ...sectionLayout,
      {
        i: uuid(),
        x: (sectionLayout.length * 2) % 12,
        y: Infinity,
        w: 5,
        h: 5,
        stickers: new Array<Layout>(),
      },
    ]);
  };

  const handleSectionRemove = (itemKey: string) => {
    return () => {
      setSectionLayout([
        ...sectionLayout.filter((item: NestedLayout) => item.i !== itemKey),
      ]);
    };
  };

  return {
    sectionLayout,
    handleStickerLayoutChange,
    handleSectionLayoutChange,
    handleSectionAdd,
    handleSectionRemove,
  };
}

export default useBoardLayout;
