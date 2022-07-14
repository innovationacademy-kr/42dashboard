import { useState, useEffect } from 'react';
import './styles.css';
import './styles2.css';
import RGL, { Layout, WidthProvider } from 'react-grid-layout';
import Section from './Section';
import usePreset from '../../../application/services/usePreset';
import PresetType from '../../../domain/preset/preset.type';
import useBoardLayout from '../../../application/services/useBoardLayout';
const ReactGridLayout = WidthProvider(RGL.Responsive);
interface NestedLayout extends Layout {
  sticker: Layout[];
}

export interface BoardProps {
  preset: PresetType;
}

export default function Board() {
  const {
    layout,
    handleSectionAdd,
    handleSectionLayoutChange,
    handleStickerLayoutChange,
    handleSectionRemove,
  } = useBoardLayout();

  const { preset, getPreset, changePreset } = usePreset();

  function drawBoard() {
    return layout.map((item: NestedLayout) => {
      return (
        <div key={item.i}>
          <Section />
        </div>
      );
    });
  }

  return (
    <>
      <button onClick={handleSectionAdd}>Add Section Item</button>
      <ReactGridLayout
        onDragStart={(a, b, c, d, e) => e.stopPropagation()}
        layouts={{ lg: layout }}
        breakpoints={{ lg: 600, md: 498, sm: 384, xs: 240, xxs: 0 }}
        cols={{ lg: 5, md: 4, sm: 3, xs: 2, xxs: 1 }}
        onLayoutChange={handleSectionLayoutChange}
        className="layout"
        rowHeight={30} // rowHeight는 각 셀의 높이, but changable.
      >
        {drawBoard()}
      </ReactGridLayout>
    </>
  );
}
