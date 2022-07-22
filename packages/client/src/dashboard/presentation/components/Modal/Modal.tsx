import { Box, Modal } from '@mui/material';
import { ReactNode, useEffect, useState } from 'react';
import styled from '@emotion/styled';
import useFiltersModal from '../../../application/services/useFiltersModal';
import ModalDatasType from './Stepper';
import HorizontalLinearStepper from './Stepper';

interface ModalProps {
  func: () => void;
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

export interface QueryFilterType {
  entityName: string;
  column: string;
  operator: string;
  givenValue: string;
  latest: boolean;
}

const ModalFrame = (props: ModalProps) => {
  const { func } = props;
  const { isOpen, cancelFiltersModal, applyFiltersModal } = useFiltersModal();
  const [type, setType] = useState('');
  const [labels, setLabels] = useState<string[]>([]);
  const [filters, setFilters] = useState<QueryFilterType[]>([]);

  function AddStickerDataset() {
    func();
    applyFiltersModal();
    const str = JSON.stringify(filters);
    console.log(
      `***APPLY BUTTON*** Type: ${type} Labels: ${labels} Filters: ${str})`,
    );
    setLabels((labels) => []);
    setFilters((filters) => []);
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
      {/* <Contents> */}
      {/* <Box sx={style}>{contents())}</Box> */}
      <Box sx={style}>
        <HorizontalLinearStepper
          setType={setType}
          setLabels={setLabels}
          setFilters={setFilters}
          applyFiltersModal={AddStickerDataset}
        />
      </Box>
      {/* <ButtonArea>
        <Button
          onClick={() => {
            func();
            applyFiltersModal();
          }}
        >
          APPLY
        </Button>
        <Button onClick={() => cancelFiltersModal()}>CLOSE</Button>
      </ButtonArea> */}
      {/* </Contents> */}
    </Modal>
  );
};

export default ModalFrame;
