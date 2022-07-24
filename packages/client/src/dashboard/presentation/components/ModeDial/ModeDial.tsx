import * as React from 'react';
import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import MenuIcon from '@mui/icons-material/Menu';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import IosShareIcon from '@mui/icons-material/IosShare';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import useMode from '../../../application/services/useMode';

export default function ModeDial() {
  const { setControlMode } = useMode();
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
    </Box>
  );
}
