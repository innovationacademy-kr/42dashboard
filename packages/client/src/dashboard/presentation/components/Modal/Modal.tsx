import { Box, Modal } from '@mui/material';
import { useState } from 'react';
import { QueryFilterType } from '../../../application/services/useDataset';
import { StickerContentType } from '../Sticker/StickerContent.type';
import StickerDataType from '../../../domain/stickerDatas/stickerData.type';
import makeStickerData from './makeStickerData';
import StickerStepper from './StickerStepper';

interface ModalProps {
  sectionId: string;
  renderAddedSticker: (sectionId: string, stickerId: string) => void;
  addStickerData: (sticker: StickerDataType) => Promise<void>;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const style = {
  position: 'absolute',
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

const ModalFrame = (props: ModalProps) => {
  const { sectionId, renderAddedSticker, addStickerData, isOpen, setIsOpen } =
    props;

  const [type, setType] = useState<StickerContentType>('lineChart');
  const [labels, setLabels] = useState<string[]>([]);
  const [filters, setFilters] = useState<QueryFilterType[]>([]);
  const [dataSets, setDataSets] = useState<QueryFilterType[][]>([[]]);

  function AddStickerDataset() {
    const newStickerData = makeStickerData({
      sectionId,
      type,
      labels,
      labelFilter: filters,
      arrayOfDataSet: dataSets,
    });
    /** turn off modal */
    setIsOpen(false);
    /** store sticker data to store */
    addStickerData(newStickerData);
    /** render sticker */
    renderAddedSticker(sectionId, newStickerData.id);
    setLabels([]);
    setFilters([]);
    setDataSets([[]]);
  }

  return (
    <Modal
      open={isOpen}
      onClose={() => setIsOpen(false)}
      style={{
        position: 'relative',
        left: 'calc(50vw - 250px)',
        top: 'calc(50vh - 550px)',
        width: '500px',
        height: '500px',
        padding: '20px',
      }}
    >
      <Box sx={style}>
        <StickerStepper
          dataSets={dataSets}
          setType={setType}
          setLabels={setLabels}
          setFilters={setFilters}
          setDataSets={setDataSets}
          applyFiltersModal={AddStickerDataset}
        />
      </Box>
    </Modal>
  );
};

export default ModalFrame;
