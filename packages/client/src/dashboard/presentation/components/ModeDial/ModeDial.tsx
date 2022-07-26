import * as React from 'react';
import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import MenuIcon from '@mui/icons-material/Menu';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import IosShareIcon from '@mui/icons-material/IosShare';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import useMode from '../../../application/services/useMode';
import styled from '@emotion/styled';

export default function ModeDial() {
  const { setControlMode, getControlMode } = useMode();
  const mode = getControlMode();

  const RoundButton = styled.button`
    position: relative;
    top: 184px;
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
  return (
    <Box
      sx={{
        height: 270,
        transform: 'translateZ(0px)',
        flexGrow: 1,
        position: 'fixed',
        right: 25,
        bottom: 0,
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
        </SpeedDial>
      )}
    </Box>
  );
}
