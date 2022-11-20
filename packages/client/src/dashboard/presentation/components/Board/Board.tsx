import './styles.css';
import './styles2.css';
import RGL, { Layout, WidthProvider } from 'react-grid-layout';
import Section from './Section';
import useSections from '../../../application/services/useSectionDatas';
import useBoard from '../../../application/services/useBoard';
import useMode, {
  getControlMode,
  setControlMode,
} from '../../../application/services/useMode';
import { v4 as uuid } from 'uuid';
import SectionDataType from '../../../domain/sectionDatas/sectionData.type';
import { BoardEditToolBar } from '../Common/EditToolBar';
import styled from '@emotion/styled';
import { useState, useEffect } from 'react';

const ReactGridLayout = WidthProvider(RGL.Responsive);

type BoardWrapperProps = {
  status: string;
};

const BoardWrapper = styled.div<BoardWrapperProps>`
  padding: '0',
  overflowY: 'auto',
  maxHeight: ${(props) => (props.status === 'fullscreen' ? `100vh` : `88vh`)};
  width: ${(props) =>
    props.status === 'fullscreen' ? `100vw` : `calc(100vw - 240px)`};
`;

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

  const { controlModeData } = useMode();
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
        <div
          key={section.i}
          style={{
            backgroundColor: '#F5F5F5',
            boxShadow:
              '0px 3px 5px -1px rgb(0 0 0 / 20%), 0px 6px 10px 0px rgb(0 0 0 / 14%)',
          }}
        >
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
    <BoardWrapper status={controlModeData}>
      {controlModeData === 'edit' && (
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
    </BoardWrapper>
  );
}
