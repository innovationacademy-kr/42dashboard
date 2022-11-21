import React from 'react';
import styled from '@emotion/styled';
import SectionDataType, {
  PeriodFilterType,
} from '../../../domain/sectionDatas/sectionData.type';
import PeriodModal from '../PeriodModal/PeriodModal';
import { StickerContentFactoryProps } from '../Sticker/StickerContentFactory';
import { ReactComponent as IconRemove } from '../../../../assets/icons/xmark-solid.svg';
import { ReactComponent as IconAdd } from '../../../../assets/icons/plus-solid.svg';
import { ReactComponent as IconSave } from '../../../../assets/icons/floppy-disk-solid.svg';
import SettingsIcon from '@mui/icons-material/Settings';
import { getControlMode } from '../../../application/services/useMode';
import { createSvgIcon } from '@mui/material/utils';

const FilterInfo = styled.span`
  margin-left: 0.5rem;
`;

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
  // border: 1px solid blue;
  background-color: lightgrey;
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
        onClick={handleSavePreset} // TODO save preset label.
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
      {getControlMode() === 'edit' && (
        <Button
          onClick={() => {
            setIsOpen && setIsOpen(true);
          }}
        >
          <IconAdd style={{ width: '1rem' }} />
        </Button>
      )}
      {periodFilter &&
        setStartDate &&
        setEndDate &&
        setGrade &&
        getControlMode() === 'edit' && (
          <PeriodModal
            setStartDate={setStartDate}
            setEndDate={setEndDate}
            setGrade={setGrade}
            periodFilter={periodFilter || {}}
          />
        )}
      {startDate && endDate && !grade && (
        <FilterInfo>
          {startDate.getFullYear()}/{startDate.getMonth()}/{startDate.getDate()}
          ~{endDate.getFullYear()}/{endDate.getMonth()}/{endDate.getDate()}
        </FilterInfo>
      )}
      {grade && !startDate && <FilterInfo>{grade}</FilterInfo>}
      {getControlMode() === 'edit' && (
        <Button
          onClick={() => removeItem && id && removeItem(id)}
          style={{ position: 'absolute', right: '0' }}
        >
          <IconRemove style={{ width: '1rem' }} />
        </Button>
      )}
    </EditToolBarArea>
  );
};
interface StickerEditToolBarProps {
  stickerId: string;
  data: StickerContentFactoryProps;
  handelStickerRemove: (id: string) => void;
  isConfigOpen: boolean;
  setIsConfigOpen: (isConfigOpen: boolean) => void;
  onHtmlToPng: () => void;
  // 설정 적용 something
  // updateStickerData:
}

const ExportIcon = createSvgIcon(
  <path d="M19 12v7H5v-7H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-6 .67l2.59-2.58L17 11.5l-5 5-5-5 1.41-1.41L11 12.67V3h2z" />,
  'SaveAlt',
);

export const StickerEditToolBar = (props: StickerEditToolBarProps) => {
  const {
    stickerId,
    handelStickerRemove,
    isConfigOpen,
    setIsConfigOpen,
    onHtmlToPng,
  } = props;

  return (
    <EditToolBarArea>
      <Button onClick={onHtmlToPng}>
        <ExportIcon style={{ width: '2rem' }} />
      </Button>
      <Button onClick={() => setIsConfigOpen(true)}>
        <SettingsIcon />
      </Button>
      <Button
        onClick={() => handelStickerRemove(stickerId)}
        style={{ position: 'absolute', right: '0' }}
      >
        <IconRemove style={{ width: '1rem' }} />
      </Button>
    </EditToolBarArea>
  );
};
