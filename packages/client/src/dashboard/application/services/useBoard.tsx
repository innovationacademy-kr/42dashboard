import { useState } from 'react';
import BoardDataService from '../../domain/boardData/boardData.service';
import BoardDataType from '../../domain/boardData/boardData.type';
import boardDataRepository from '../../infrastructure/boardData.repository';
import boardDataStore from '../../infrastructure/store/boardData.store';
import { Layout } from 'react-grid-layout';
import presetRepository from '../../infrastructure/preset.repository';
import PresetService from '../../domain/preset/preset.service';
import sectionDatasStore from '../../infrastructure/store/sectionDatas.store';
import stickerDatasStore from '../../infrastructure/store/stickerDatas.store';
import presetStore from '../../infrastructure/store/preset.store';

const boardDataService = new BoardDataService(boardDataRepository);
const presetService = new PresetService(presetRepository);

function useBoard() {
  const [boardData, setBoardData] = useState(boardDataStore.getBoardData());

  boardDataStore.subscribeToBoardData((newBoardData: BoardDataType) => {
    setBoardData(newBoardData);
  });
  const handleSavePreset = () => {
    const preset = presetStore.getPreset();
    if (!preset) return;
    const boardData = boardDataStore.getBoardData();
    const sectionDatas = sectionDatasStore.getSectionDatas();
    const stickerDatas = stickerDatasStore.getStickerDatas();
    const presetData = {
      boardData,
      sectionDatas,
      stickerDatas,
    };
    presetService.addPreset({
      id: preset.info.id,
      data: presetData,
      info: preset.info,
    });
  };
  const handleSectionAdd = (sectionId: string | undefined) => {
    if (sectionId === undefined) return;
    const newLayout = [
      ...boardData.sectionLayouts,
      {
        i: sectionId,
        x: (boardData.sectionLayouts.length * 2) % 12,
        y: Infinity,
        w: 5,
        h: 5,
      },
    ];
    boardData.sectionIds.push(sectionId);
    boardData.sectionLayouts = newLayout;
    boardDataService.updateBoardData(boardData);
  };

  const handleSectionLayoutChange = (newLayout: Array<Layout>) => {
    boardData.sectionLayouts = newLayout;
    boardDataService.updateBoardData(boardData);
  };

  const handleSectionRemove = (sectionId: string) => {
    const sectionIds = boardData.sectionIds.filter((id) => id !== sectionId);
    const sectionLayouts = boardData.sectionLayouts.filter(
      (layout) => layout.i !== sectionId,
    );
    boardData.sectionIds = sectionIds;
    boardData.sectionLayouts = sectionLayouts;
    boardDataService.updateBoardData(boardData);
  };

  return {
    boardData,
    handleSectionAdd,
    handleSectionLayoutChange,
    handleSectionRemove,
    handleSavePreset,
  };
}

export default useBoard;
