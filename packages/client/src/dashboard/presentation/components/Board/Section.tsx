import './styles.css';
import './styles2.css';
import Sticker from '../Sticker/Sticker';
import useStickers from '../../../application/services/useStickers';
import useMode from '../../../application/services/useMode';
import { Button } from '@mui/material';
import RGL, { Layout, WidthProvider } from 'react-grid-layout';
import ModalFrame from '../Modal/Modal';
import { useState } from 'react';
import HorizontalLinearStepper from '../Modal/Stepper';
import makeStickerData from '../Modal/makeStickerData';
import EditToolBar from '../Common/EditToolBar';

const ReactGridLayout = WidthProvider(RGL.Responsive);

interface SectionProps {
  id: string;
  stickerLayouts: Layout[];
  handleSectionRemove: (sectionId: string) => void;
  handleStickerAdd: (sectionId: string, stickerId: string) => void;
  handleStickerRemove: (sectionId: string, stickerId: string) => void;
  handleStickerLayoutChange: (sectionId: string, newLayout: Layout[]) => void;
}

export default function Section(props: SectionProps) {
  const { stickerDatas, addSticker, removeSticker } = useStickers();
  const {
    id,
    stickerLayouts,
    handleSectionRemove,
    handleStickerAdd,
    handleStickerLayoutChange,
    handleStickerRemove,
  } = props;
  const [isOpen, setIsOpen] = useState(false);
  const { getControlMode } = useMode();

  function drawStickers() {
    return stickerLayouts.map((sticker: Layout, idx) => (
      <div key={sticker.i}>
        <Sticker
          id={sticker.i}
          data={stickerDatas[idx].data}
          handleStickerRemove={(stickerId) => {
            removeSticker(stickerId);
            handleStickerRemove(id, stickerId);
          }}
        />
      </div>
    ));
  }

  return (
    <>
      {getControlMode() === 'edit' && (
        <EditToolBar
          type="Section"
          setIsOpen={setIsOpen}
          removeItem={handleSectionRemove}
          id={id}
        />
      )}
      <ModalFrame
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        sectionId={id}
        func={handleStickerAdd}
        addSticker={addSticker}
      ></ModalFrame>
      <ReactGridLayout
        onDragStart={(a, b, c, d, e) => e.stopPropagation()}
        layouts={{ lg: stickerLayouts }}
        breakpoints={{ lg: 600, md: 498, sm: 384, xs: 240, xxs: 0 }}
        cols={{ lg: 8, md: 5, sm: 4, xs: 2, xxs: 1 }}
        onLayoutChange={(newLayout) => {
          handleStickerLayoutChange(id, newLayout);
        }}
        className="layout"
        rowHeight={30}
      >
        {drawStickers()}
      </ReactGridLayout>
    </>
  );
}
