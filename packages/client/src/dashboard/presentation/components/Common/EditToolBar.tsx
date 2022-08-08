import React from 'react';
import styled from '@emotion/styled';
import useSections from '../../../application/services/useSectionDatas';
import useBoard from '../../../application/services/useBoard';
import SectionDataType, {
  PeriodFilterType,
} from '../../../domain/sectionDatas/sectionData.type';
import { Button } from '@mui/material';
import PeriodModal from '../PeriodModal/PeriodModal';

type ToolType = 'Board' | 'Section' | 'Sticker';

interface EditToolBarProps {
  type: ToolType;
  sectionData?: SectionDataType | undefined;
  sectionId?: string | undefined;
  setIsOpen?: ((isOpen: boolean) => void) | undefined;
  removeItem?: ((id: string) => void) | undefined;
  id?: string;
  periodFilter?: PeriodFilterType;
  setStartDate?: React.Dispatch<React.SetStateAction<Date | undefined>>;
  setEndDate?: React.Dispatch<React.SetStateAction<Date | undefined>>;
  setGrade?: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const EditToolBarArea = styled.div`
  display: flex;
  width: 100%;
  height: 2rem;
  justify-content: space-between;
  border: 1px solid blue;
`;

// TODO: hybae
// Section - Remove Section 추가
// Sticker - Apply Filter 추가
// Sticker - Remove Sticker 추가

const EditToolBar = (props: EditToolBarProps) => {
  const { addSectionData } = useSections();
  const { handleSectionAdd, handleSavePreset } = useBoard();
  const {
    type,
    sectionData,
    sectionId,
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
      {type === 'Board' && (
        <Button
          onClick={() => {
            addSectionData(sectionData);
            handleSectionAdd(sectionId);
          }}
        >
          Add Section
        </Button>
      )}
      {type === 'Section' && (
        <Button onClick={() => setIsOpen && setIsOpen(true)}>
          Add Sticker
        </Button>
      )}
      {type === 'Section' &&
        periodFilter &&
        setStartDate &&
        setEndDate &&
        setGrade && (
          <PeriodModal
            setStartDate={setStartDate}
            setEndDate={setEndDate}
            setGrade={setGrade}
            periodFilter={periodFilter || {}}
          />
        )}
      {type === 'Sticker' && <Button>Apply Filter</Button>}
      {type === 'Board' && (
        <Button onClick={() => handleSavePreset()}>Save Preset</Button>
      )}
      {type === 'Section' && (
        <Button onClick={() => removeItem && id && removeItem(id)}>
          Remove
        </Button>
      )}
      {type === 'Sticker' && (
        <Button onClick={() => removeItem && id && removeItem(id)}>
          Remove
        </Button>
      )}
    </EditToolBarArea>
  );
};
export default EditToolBar;
