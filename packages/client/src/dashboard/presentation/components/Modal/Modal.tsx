import { Box, Input, Modal } from '@mui/material';
import { ReactNode } from 'react';

import styled from '@emotion/styled';
import useFiltersModal from '../../../application/services/useFiltersModal';
import InputDataset from './InputDataset';

interface ModalProps {
  contents: () => ReactNode;
}

const ButtonArea = styled.div`
  display: flex;
  justify-content: space-around;
`;

const Button = styled.button`
  width: 150px;
  height: 30px;
  cursor: pointer;
`;

const Contents = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const ModalFrame = (props: ModalProps) => {
  const { contents } = props;
  const { isOpen, cancelFiltersModal, applyFiltersModal } = useFiltersModal();
  return (
    <Modal
      open={isOpen}
      onClose={cancelFiltersModal}
      style={{
        position: 'relative',
        left: 'calc(50vw - 250px)',
        top: 'calc(50vh - 350px)',
        width: '500px',
        height: '500px',
        padding: '20px',
        backgroundColor: 'darkgrey',
      }}
    >
      <Contents>
        <InputDataset />
        <ButtonArea>
          <Button onClick={() => applyFiltersModal()}>APPLY</Button>
          <Button onClick={() => cancelFiltersModal()}>CLOSE</Button>
        </ButtonArea>
      </Contents>
    </Modal>
  );
};

export default ModalFrame;
