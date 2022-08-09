import './styles.css';
import './styles2.css';
import RGL, { Layout, WidthProvider } from 'react-grid-layout';
import Section from './Section';
import useSections from '../../../application/services/useSectionDatas';
import useBoard from '../../../application/services/useBoard';
import useMode from '../../../application/services/useMode';
import { v4 as uuid } from 'uuid';
import SectionDataType from '../../../domain/sectionDatas/sectionData.type';
import { BoardEditToolBar } from '../Common/EditToolBar';

const ReactGridLayout = WidthProvider(RGL.Responsive);

export default function Board() {
  const {
    addSectionData,
    removeSectionData,
    getSectionDatas,
    handleStickerAdd,
    handleStickerRemove,
    handleStickerLayoutChange,
    handlePreriodFilterUpdate,
  } = useSections();

  const {
    boardData,
    handleSectionAdd,
    handleSectionLayoutChange,
    handleSectionRemove,
    handleSavePreset,
  } = useBoard();

  const { getControlMode } = useMode();

  const sectionData: SectionDataType = {
    id: uuid(),
    periodFilter: {
      startDate: undefined,
      endDate: undefined,
      grade: undefined,
    },
    stickerIds: [],
    stickerLayouts: [],
  };

  function drawSections() {
    return boardData.sectionLayouts.map((section: Layout) => {
      const stickerLayouts = getSectionDatas(section.i)?.stickerLayouts;
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
            handlePreriodFilterUpdate={handlePreriodFilterUpdate}
          />
        </div>
      );
    });
  }

  return (
    <div
      style={{
        padding: '1rem',
        overflowY: 'scroll',
        maxHeight: '88vh',
      }}
    >
      {getControlMode() === 'edit' && (
        <BoardEditToolBar
          sectionData={sectionData}
          addSectionData={addSectionData}
          handleSectionAdd={handleSectionAdd}
          handleSavePreset={handleSavePreset}
        />
      )}
      <ReactGridLayout
        onDragStart={(a, b, c, d, e) => e.stopPropagation()}
        layouts={{ lg: boardData.sectionLayouts || [] }}
        breakpoints={{ lg: 600 }}
        cols={{ lg: 8, md: 5, sm: 4, xs: 2, xxs: 1 }}
        onLayoutChange={handleSectionLayoutChange}
        className="layout"
        rowHeight={30}
      >
        {drawSections()}
      </ReactGridLayout>
    </div>
  );
}
