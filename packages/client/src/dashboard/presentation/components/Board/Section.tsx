import './styles.css';
import './styles2.css';
import Sticker from '../Sticker/Sticker';
import useStickers from '../../../application/services/useStickers';
import useMode from '../../../application/services/useMode';
import RGL, { Layout, WidthProvider } from 'react-grid-layout';
import ModalFrame from '../Modal/Modal';
import { useState, useEffect } from 'react';
import EditToolBar from '../Common/EditToolBar';
import { useQuery } from '@apollo/client';

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
  const { stickerDatas, addStickerData, removeSticker } = useStickers();
  const {
    id,
    stickerLayouts,
    handleSectionRemove,
    handleStickerAdd,
    handleStickerLayoutChange,
    handleStickerRemove,
  } = props;
  const [isOpen, setIsOpen] = useState(false);
  // const [endDate, setEndDate] = useState(now.current);
  // const [startDate, setStartDate] = useState(now.current);
  const [startDate, setStartDate] = useState(new Date(0));
  const [endDate, setEndDate] = useState(new Date(0));
  const [grade, setGrade] = useState('');
  const [isChecked, setIsChecked] = useState(''); //TODO(sonkang) : 필요한지 생각해야 함
  const { getControlMode } = useMode();

  console.log('startDate !!!: ', startDate);
  function drawStickers() {
    return stickerLayouts.map((sticker: Layout, idx) => (
      <div key={sticker.i}>
        {/* TODO(sonkang) : 나중에 더 좋은 방법을 찾아보기 */}
        {stickerDatas[idx] && (
          <Sticker
            id={sticker.i}
            data={stickerDatas[idx].data}
            handleStickerRemove={(stickerId) => {
              removeSticker(stickerId);
              handleStickerRemove(id, stickerId);
            }}
          />
        )}
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
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          setIsChecked={setIsChecked}
          grade={grade}
          setGrade={setGrade}
        />
      )}
      <ModalFrame
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        sectionId={id}
        renderAddedSticker={handleStickerAdd}
        addStickerData={addStickerData}
        startDate={startDate.toISOString()}
        endDate={endDate.toISOString()}
      ></ModalFrame>
      <ReactGridLayout
        onDragStart={(a, b, c, d, e) => e.stopPropagation()}
        layouts={{ lg: stickerLayouts }}
        breakpoints={{ lg: 600 }}
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
