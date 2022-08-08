import { Box, Modal } from '@mui/material';
import { useState } from 'react';
import { StickerContentType } from '../Sticker/StickerContent.type';
import StickerDataType from '../../../domain/stickerDatas/stickerData.type';
import StickerStepper from './StickerStepper';
import { FilterConfigType } from '../Sticker/Filter.type';
import {
  makeTableStickerData,
  makeChartStickerData,
  makeTextStickerData,
  makeBachelorStickerData,
} from './makeStickerData';

interface ModalProps {
  sectionId: string;
  renderAddedSticker: (sectionId: string, stickerId: string) => void;
  addStickerData: (sticker: StickerDataType) => Promise<void>;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  startDate?: Date;
  endDate?: Date;
}

const stepperStyle = {
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

const ModalFrame = (props: ModalProps) => {
  const { sectionId, renderAddedSticker, addStickerData, isOpen, setIsOpen } =
    props;

  const [type, setType] = useState<StickerContentType>('none');
  const [labels, setLabels] = useState<string[]>([]);
  const [filters, setFilters] = useState<FilterConfigType[]>([]);
  const [datasets, setDatasets] = useState<FilterConfigType[][]>([[]]);
  const [datasetNames, setDatasetNames] = useState<string[]>([]);
  const [reset, setReset] = useState(false);

  /** switch to type & handle properly */
  function AddStickerDataset() {
    let newStickerData: StickerDataType | null = null;
    if (type === 'bachelor') {
      newStickerData = makeBachelorStickerData({
        sectionId,
        type,
      });
    }
    if (type === 'table') {
      newStickerData = makeTableStickerData({
        sectionId,
        type,
      });
    }
    if (type === 'text') {
      newStickerData = makeTextStickerData({
        sectionId,
        type,
      });
    }
    if (type === 'barChart' || type === 'lineChart' || type === 'pieChart') {
      newStickerData = makeChartStickerData({
        sectionId,
        type,
        labels,
        labelFilter: filters,
        datasetNames,
        arrayOfDataSet: datasets,
      });
    }

    if (newStickerData !== null) {
      /** store sticker data to store */
      addStickerData(newStickerData);
      /** render sticker */
      renderAddedSticker(sectionId, newStickerData.id);
    }
    /** turn off modal */
    setIsOpen(false);
    /** init state */
    setType('none');
    setLabels([]);
    setFilters([]);
    setDatasets([[]]);
    setDatasetNames([]);
  }

  const chartProps = {
    labels,
    setLabels,
    filters,
    setFilters,
    datasets,
    setDatasets,
    datasetNames,
    setDatasetNames,
  };

  return (
    <Modal
      open={isOpen}
      onClose={() => {
        setIsOpen(false);
        setReset(true);
      }}
      style={{
        position: 'relative',
        left: 'calc(50vw - 250px)',
        top: 'calc(50vh - 550px)',
        width: '500px',
        height: '500px',
        padding: '20px',
      }}
    >
      <Box sx={stepperStyle}>
        <StickerStepper
          chartProps={chartProps}
          type={type}
          setType={setType}
          applyFiltersModal={AddStickerDataset}
          reset={reset}
          setReset={setReset}
        />
      </Box>
    </Modal>
  );
};

export default ModalFrame;
