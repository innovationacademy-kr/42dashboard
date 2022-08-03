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
} from './makeStickerData';

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

  const [type, setType] = useState<StickerContentType>('none');
  const [labels, setLabels] = useState<string[]>([]);
  const [filters, setFilters] = useState<FilterConfigType[]>([]);
  const [datasets, setDatasets] = useState<FilterConfigType[][]>([[]]);
  const [datasetNames, setDatasetNames] = useState<string[]>([]);

  /** switch to type & handle properly */
  function AddStickerDataset() {
    /** make sticker data */
    if (type === 'barChart' || type === 'lineChart' || type === 'pieChart') {
      const newStickerData = makeChartStickerData({
        sectionId,
        type,
        labels,
        labelFilter: filters,
        datasetNames,
        arrayOfDataSet: datasets,
      });
      /** store sticker data to store */
      addStickerData(newStickerData);
      /** render sticker */
      renderAddedSticker(sectionId, newStickerData.id);
    }
    if (type === 'table') {
      const newStickerData: StickerDataType = makeTableStickerData({
        sectionId,
        type,
      });
      /** store sticker data to store */
      addStickerData(newStickerData);
      /** render sticker */
      renderAddedSticker(sectionId, newStickerData.id);
    }
    if (type === 'text') {
      const newStickerData: StickerDataType = makeTextStickerData({
        sectionId,
        type,
      });
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
    setDatasets([]);
    setDatasetNames([]);
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
          datasets={datasets}
          type={type}
          setType={setType}
          setLabels={setLabels}
          setFilters={setFilters}
          setDatasets={setDatasets}
          datasetNames={datasetNames}
          setDatasetNames={setDatasetNames}
          applyFiltersModal={AddStickerDataset}
        />
      </Box>
    </Modal>
  );
};

export default ModalFrame;
