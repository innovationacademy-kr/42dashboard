import * as React from 'react';
import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import MenuIcon from '@mui/icons-material/Menu';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import IosShareIcon from '@mui/icons-material/IosShare';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import RefreshIcon from '@mui/icons-material/Refresh';
import useMode from '../../../application/services/useMode';
import styled from '@emotion/styled';
import { gql, NetworkStatus, useLazyQuery, useQuery } from '@apollo/client';
import { keyframes } from '@emotion/react';
import * as axios from './../../../infrastructure/http/axios/axios.custom';

const RoundButton = styled.button`
  position: relative;
  top: 240px;
  border-radius: 50%;
  width: 56px;
  height: 56px;
  border: 0px;
  background-color: #1976d2;
  color: white;
  cursor: pointer;
  box-shadow: 0px 3px 5px -1px rgb(0 0 0 / 20%),
    0px 6px 10px 0px rgb(0 0 0 / 14%), 0px 1px 18px 0px rgb(0 0 0 / 12%);
  &:hover {
    background-color: #1565c0;
  }
`;

const rotation = keyframes`
from {
  transform: rotate(0deg);
}
to {
  transform: rotate(360deg);
}`;

const RotateRefreshIcon = styled(RefreshIcon)`
  &.loading {
    animation: ${rotation} 1s linear infinite;
    transform-origin: 50% 50%;
  }
`;

export default function ModeDial() {
  const { setControlMode, getControlMode } = useMode();
  const [refetchState, setRefetchState] = React.useState('data');

  const mode = getControlMode();

  return (
    <Box
      sx={{
        height: 270,
        transform: 'translateZ(0px)',
        flexGrow: 1,
        position: 'fixed',
        right: 25,
        bottom: 56,
      }}
    >
      {mode === 'edit' && (
        <RoundButton onClick={() => setControlMode('view')}>VIEW</RoundButton>
      )}
      {mode !== 'edit' && (
        <SpeedDial ariaLabel="ModeDial" icon={<MenuIcon />}>
          <SpeedDialAction
            icon={<ModeEditIcon />}
            tooltipTitle={'EditMode'}
            onClick={() => {
              setControlMode('edit');
            }}
          />
          <SpeedDialAction
            icon={<FullscreenIcon />}
            tooltipTitle={'Fullscreen'}
            onClick={() => {
              setControlMode('fullscreen');
            }}
          />
          <SpeedDialAction
            icon={<IosShareIcon />}
            tooltipTitle={'Export'}
            onClick={() => {
              setControlMode('export');
            }}
          />
          <SpeedDialAction
            icon={<RotateRefreshIcon className={refetchState} />}
            tooltipTitle={'Refresh'}
            onClick={() => {
              setRefetchState('loading');
              console.log(`loading`);
              axios
                .axiosUpdateData()
                .then((data) => {
                  setRefetchState('data');
                  console.log(`data`);
                })
                .catch((error) => {
                  setRefetchState('error');
                  console.log(`error`);
                });
            }}
          />
        </SpeedDial>
      )}
    </Box>
  );
}
