import { Box, Modal } from '@mui/material';
import { useState } from 'react';
import useFiltersModal from '../../../application/services/useFiltersModal';
import HorizontalLinearStepper from './Stepper';
import { v4 as uuid } from 'uuid';
import { QueryFilterType } from '../../../application/services/useDataset';
import { StickerContentType } from '../Sticker/StickerContent.type';
import StickerDataType from '../../../domain/stickerDatas/stickerData.type';
import makeStickerData from './makeStickerData';

interface ModalProps {
  sectionId: string;
  func: (sectionId: string, stickerId: string) => void;
  addSticker: (sticker: StickerDataType) => Promise<void>;
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
  const { sectionId, func, addSticker } = props;
  const { isOpen, cancelFiltersModal, applyFiltersModal } = useFiltersModal();
  const [type, setType] = useState<StickerContentType>('lineChart');
  const [labels, setLabels] = useState<string[]>([]);
  const [filters, setFilters] = useState<QueryFilterType[]>([]);
  const [dataSets, setDataSets] = useState<QueryFilterType[][]>([[]]);

  function AddStickerDataset() {
    const newStickerData = makeStickerData({
      sectionId: sectionId,
      type,
      labels,
      labelFilter: filters,
      arrayOfDataSet: dataSets,
    });
    /** turn off modal */
    applyFiltersModal();
    /** store sticker data to store */
    addSticker(newStickerData);
    /** render sticker */
    func(sectionId, newStickerData.id);
    const str = JSON.stringify(filters);
    const data = JSON.stringify(dataSets);
    console.log(
      `***APPLY BUTTON*** Type: ${type} Labels: ${labels} Filters: ${str} dataSets: ${data})`,
    );
    setLabels((labels) => []);
    setFilters((filters) => []);
    setDataSets((dataSets) => [[]]);
  }

  return (
    <Modal
      open={isOpen}
      onClose={cancelFiltersModal}
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
        <HorizontalLinearStepper
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
