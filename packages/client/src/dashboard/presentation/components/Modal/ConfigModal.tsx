import styled from '@emotion/styled';
import { Box, Button, Modal } from '@mui/material';
import { useState } from 'react';
import { StickerContentFactoryProps } from '../Sticker/StickerContentFactory';
import ColumnSelector from '../Table/ColumnSelector';
import { TableProps } from '../Table/Table';
import { TextProps } from '../Text/TextStickerContent';

const configModalStyle = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 1000,
  height: 700,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

interface ConfigModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  stickerId: string;
  stickerFactoryData: StickerContentFactoryProps;
  handleStickerUpdate: (
    stickerId: string,
    stickerData: StickerContentFactoryProps,
  ) => void;
}

function ConfigModal(props: ConfigModalProps) {
  const {
    isOpen,
    setIsOpen,
    stickerId,
    stickerFactoryData,
    handleStickerUpdate,
  } = props;
  return (
    <Modal
      open={isOpen}
      onClose={() => {
        setIsOpen(false);
      }}
    >
      <Box sx={configModalStyle}>
        {/* Sticker Content type에 따라서 조건부 랜더링 */}
        <StickerConfigHOC
          stickerId={stickerId}
          stickerFactoryData={stickerFactoryData}
          handleStickerUpdate={handleStickerUpdate}
          setIsOpen={setIsOpen}
        />
      </Box>
    </Modal>
  );
}

interface StickerConfigProps {
  stickerId: string;
  stickerFactoryData: StickerContentFactoryProps;
  handleStickerUpdate: (
    stickerId: string,
    stickerData: StickerContentFactoryProps,
  ) => void;
  setIsOpen: (isOpen: boolean) => void;
}

function StickerConfigHOC(props: StickerConfigProps) {
  const { stickerId, stickerFactoryData, handleStickerUpdate, setIsOpen } =
    props;
  const stickerConfig =
    stickerFactoryData.type === 'table' ? (
      <TableStickerConfig
        stickerId={stickerId}
        stickerFactoryData={stickerFactoryData}
        handleStickerUpdate={handleStickerUpdate}
        setIsOpen={setIsOpen}
      />
    ) : stickerFactoryData.type.match(/.+Chart/) ? (
      <ChartStickerConfig />
    ) : stickerFactoryData.type === 'text' ? (
      <TextStickerConfig
        stickerId={stickerId}
        stickerFactoryData={stickerFactoryData}
        handleStickerUpdate={handleStickerUpdate}
        setIsOpen={setIsOpen}
      />
    ) : (
      <div>설정을 지원하지 않는 스티커입니다.</div>
    );
  return stickerConfig;
}

function TableStickerConfig(props: StickerConfigProps) {
  const { stickerId, stickerFactoryData, handleStickerUpdate, setIsOpen } =
    props;
  const { columns, visibleColumns } =
    stickerFactoryData.contentProps as TableProps;
  const [selectedColumns, setSelectedColumns] =
    useState<boolean[]>(visibleColumns);

  const handleColumnVisibilityChange = (index: number) => {
    const newVisibleColumns = [...selectedColumns];
    newVisibleColumns[index] = !newVisibleColumns[index];
    setSelectedColumns(newVisibleColumns);
  };

  const updateStickerDataAndCloseModal = () => {
    (stickerFactoryData.contentProps as TableProps).visibleColumns =
      selectedColumns;
    setIsOpen(false);
    handleStickerUpdate(stickerId, stickerFactoryData);
  };
  return (
    <>
      <ColumnSelector
        columns={columns}
        columnsVisibility={selectedColumns}
        handleColumnVisibilityChange={handleColumnVisibilityChange}
      />
      <Button onClick={updateStickerDataAndCloseModal}>적용하기</Button>
    </>
  );
}

const TextContent = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 0.5rem;
`;

const TextEdit = styled.input`
  width: 100%;
  height: 100%;
`;

function TextStickerConfig(props: StickerConfigProps) {
  const { stickerId, stickerFactoryData, handleStickerUpdate, setIsOpen } =
    props;
  const { content } = stickerFactoryData.contentProps as TextProps;
  const [textValue, setTextValue] = useState<string>(
    content ?? '새로운 텍스트',
  );

  const handleTextEdit = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTextValue(e.target.value);
  };

  const updateStickerDataAndCloseModal = () => {
    (stickerFactoryData.contentProps as TextProps).content = textValue;
    setIsOpen(false);
    handleStickerUpdate(stickerId, stickerFactoryData);
  };

  return (
    <TextContent>
      <TextEdit onChange={handleTextEdit} value={textValue} />
      <Button onClick={updateStickerDataAndCloseModal}>적용하기</Button>
    </TextContent>
  );
}

function ChartStickerConfig() {
  return (
    <div>
      차트 스티커 설정은 현재 지원하지 않습니다. 차트 추가 기능을 이용해주세요
    </div>
  );
}

export default ConfigModal;
