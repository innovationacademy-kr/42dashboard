import React from 'react';
import styled from '@emotion/styled';
import SectionDataType, {
  PeriodFilterType,
} from '../../../domain/sectionDatas/sectionData.type';
import { Button } from '@mui/material';
import PeriodModal from '../PeriodModal/PeriodModal';

const EditToolBarArea = styled.div`
  display: flex;
  width: 100%;
  height: 2rem;
  justify-content: space-between;
  border: 1px solid blue;
`;

interface BoardEditToolBarProps {
  sectionData: SectionDataType;
  addSectionData: (sectionData: SectionDataType) => void;
  handleSectionAdd: (sectionId: string) => void;
  handleSavePreset: () => void;
}

export const BoardEditToolBar = (props: BoardEditToolBarProps) => {
  const { sectionData, addSectionData, handleSectionAdd, handleSavePreset } =
    props;
  return (
    <EditToolBarArea>
      <Button
        onClick={() => {
          addSectionData(sectionData);
          handleSectionAdd(sectionData.id);
        }}
      >
        Add Section
      </Button>
      <Button onClick={handleSavePreset}>Save Preset</Button>
    </EditToolBarArea>
  );
};

export interface SectionEditToolBarProps {
  setIsOpen?: ((isOpen: boolean) => void) | undefined;
  removeItem?: ((id: string) => void) | undefined;
  id?: string;
  periodFilter?: PeriodFilterType;
  setStartDate?: React.Dispatch<React.SetStateAction<Date | undefined>>;
  setEndDate?: React.Dispatch<React.SetStateAction<Date | undefined>>;
  setGrade?: React.Dispatch<React.SetStateAction<string | undefined>>;
}

export const SectionEditToolBar = (props: SectionEditToolBarProps) => {
  const {
    setIsOpen,
    removeItem,
    id,
    setStartDate,
    setEndDate,
    setGrade,
    periodFilter,
  } = props;

  return (
    <EditToolBarArea>
      {
        <Button
          onClick={() => {
            setIsOpen && setIsOpen(true);
          }}
        >
          Add Sticker
        </Button>
      }
      {periodFilter && setStartDate && setEndDate && setGrade && (
        <PeriodModal
          setStartDate={setStartDate}
          setEndDate={setEndDate}
          setGrade={setGrade}
          periodFilter={periodFilter || {}}
        />
      )}
      {
        <Button onClick={() => removeItem && id && removeItem(id)}>
          Remove
        </Button>
      }
    </EditToolBarArea>
  );
};
interface StickerEditToolBarProps {
  stickerId: string;
  handelStickerRemove: (id: string) => void;
  // 설정 적용 something
  // updateStickerData:
}

export const StickerEditToolBar = (props: StickerEditToolBarProps) => {
  const { stickerId, handelStickerRemove } = props;
  return (
    <EditToolBarArea>
      <Button onClick={() => handelStickerRemove(stickerId)}>Remove</Button>
    </EditToolBarArea>
  );
};
