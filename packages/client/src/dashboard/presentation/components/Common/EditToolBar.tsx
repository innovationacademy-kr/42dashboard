import React from 'react';
import styled from '@emotion/styled';
import useSections from '../../../application/services/useSectionDatas';
import useBoard from '../../../application/services/useBoard';
import SectionDataType from '../../../domain/sectionDatas/sectionData.type';
import { Button } from '@mui/material';

type ToolType = 'Board' | 'Section' | 'Sticker';

interface EditToolBarProps {
  type: ToolType;
  sectionData?: SectionDataType | undefined;
  sectionId?: string | undefined;
  setIsOpen?: ((isOpen: boolean) => void) | undefined;
  removeItem?: ((id: string) => void) | undefined;
  id?: string;
}

const EditToolBarArea = styled.div`
  display: flex;
  width: 100%;
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
  const { type, sectionData, sectionId, setIsOpen, removeItem, id } = props;

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
          Add Sticekr
        </Button>
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
