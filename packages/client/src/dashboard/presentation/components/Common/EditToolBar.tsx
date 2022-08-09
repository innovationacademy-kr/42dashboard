import React from 'react';
import styled from '@emotion/styled';
import SectionDataType, {
  PeriodFilterType,
} from '../../../domain/sectionDatas/sectionData.type';
import PeriodModal from '../PeriodModal/PeriodModal';
import { ReactComponent as IconRemove } from '../../../../assets/icons/xmark-solid.svg';
import { ReactComponent as IconAdd } from '../../../../assets/icons/plus-solid.svg';
import { ReactComponent as IconSave } from '../../../../assets/icons/floppy-disk-solid.svg';

const Button = styled.button`
  background-color: none;
  border: 0;
  outline: 0;
  cursor: pointer;
  background-color: transparent;
  &:hover {
    background-color: lightgrey;
  }
`;

const EditToolBarArea = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  height: 2rem;
  align-items: center;
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
        <IconAdd style={{ width: '1rem' }} />
      </Button>
      <Button
        onClick={handleSavePreset}
        style={{ position: 'absolute', right: '0' }}
      >
        <IconSave style={{ width: '1rem' }} />
      </Button>
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
  startDate?: Date | undefined;
  endDate?: Date | undefined;
  grade?: string | undefined;
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
    startDate,
    endDate,
    grade,
  } = props;

  return (
    <EditToolBarArea>
      {
        <Button
          onClick={() => {
            setIsOpen && setIsOpen(true);
          }}
        >
          <IconAdd style={{ width: '1rem' }} />
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
      {startDate && endDate && !grade && (
        <>
          {startDate.getFullYear()}/{startDate.getMonth()}/{startDate.getDate()}
          ~{endDate.getFullYear()}/{endDate.getMonth()}/{endDate.getDate()}
        </>
      )}
      {grade && !startDate && <>{grade}</>}
      {
        <Button
          onClick={() => removeItem && id && removeItem(id)}
          style={{ position: 'absolute', right: '0' }}
        >
          <IconRemove style={{ width: '1rem' }} />
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
      <Button
        onClick={() => handelStickerRemove(stickerId)}
        style={{ position: 'absolute', right: '0' }}
      >
        <IconRemove style={{ width: '1rem' }} />
      </Button>
    </EditToolBarArea>
  );
};
