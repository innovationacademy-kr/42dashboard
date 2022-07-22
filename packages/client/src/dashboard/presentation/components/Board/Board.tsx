import './styles.css';
import './styles2.css';
import RGL, { Layout, WidthProvider } from 'react-grid-layout';
import Section from './Section';
import PresetType from '../../../domain/preset/preset.type';
import useFiltersModal from '../../../application/services/useFiltersModal';
import useSections from '../../../application/services/useSectionDatas';
import useBoard from '../../../application/services/useBoard';
import { v4 as uuid } from 'uuid';
import SectionDataType from '../../../domain/sectionDatas/sectionData.type';
import { Button } from '@mui/material';

const ReactGridLayout = WidthProvider(RGL.Responsive);

export interface BoardProps {
  preset: PresetType;
}

export default function Board() {
  const {
    addSectionData,
    removeSectionData,
    getSectionDatas,
    handleStickerAdd,
    handleStickerRemove,
    handleStickerLayoutChange,
  } = useSections();

  const {
    boardData,
    handleSectionAdd,
    handleSectionLayoutChange,
    handleSectionRemove,
    handleSavePreset,
  } = useBoard();

  const { isOpen, openFiltersModal, applyFiltersModal, cancelFiltersModal } =
    useFiltersModal();

  const sectionData: SectionDataType = {
    id: uuid(),
    stickerIds: [],
    stickerLayouts: [],
  };

  function drawSections() {
    return boardData.sectionLayouts.map((section: Layout) => {
      const stickerLayouts = getSectionDatas(section.i)?.stickerLayouts;
      console.log(stickerLayouts, section.i);
      return (
        <div key={section.i}>
          <Section
            key={section.i}
            id={section.i}
            stickerLayouts={stickerLayouts || []}
            handleSectionRemove={(sectionId) => {
              removeSectionData(sectionId);
              handleSectionRemove(sectionId);
            }}
            handleStickerAdd={handleStickerAdd}
            handleStickerLayoutChange={handleStickerLayoutChange}
            handleStickerRemove={handleStickerRemove}
          />
        </div>
      );
    });
  }

  return (
    <>
      <Button
        onClick={() => {
          addSectionData(sectionData);
          handleSectionAdd(sectionData.id);
        }}
      >
        Add Section Item
      </Button>
      <Button
        onClick={() => {
          handleSavePreset();
        }}
      >
        프리셋 저장
      </Button>
      <ReactGridLayout
        onDragStart={(a, b, c, d, e) => e.stopPropagation()}
        layouts={{ lg: boardData.sectionLayouts || [] }}
        breakpoints={{ lg: 600, md: 498, sm: 384, xs: 240, xxs: 0 }}
        cols={{ lg: 8, md: 5, sm: 4, xs: 2, xxs: 1 }}
        onLayoutChange={handleSectionLayoutChange}
        className="layout"
        rowHeight={30}
      >
        {drawSections()}
      </ReactGridLayout>
    </>
  );
}
