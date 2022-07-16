import { useState } from 'react';
import { Layout } from 'react-grid-layout';
import { v4 as uuid } from 'uuid';

function useSectionLayout() {
  const [stickerLayout, setStickerLayout] = useState(Array<Layout>);

  const handleStickerLayoutChange = (newLayout: Array<Layout>) => {
    setStickerLayout(newLayout);
  };

  const handleStickerAdd = () => {
    setStickerLayout([
      ...stickerLayout,
      {
        i: uuid(),
        x: (stickerLayout.length * 2) % 12,
        y: Infinity,
        w: 5,
        h: 5,
      },
    ]);
  };

  const handleStickerRemove = (itemKey: string) =>
    setStickerLayout([
      ...stickerLayout.filter((item: Layout) => item.i !== itemKey),
    ]);

  return {
    stickerLayout,
    handleStickerLayoutChange,
    handleStickerAdd,
    handleStickerRemove,
  };
}

export default useSectionLayout;
