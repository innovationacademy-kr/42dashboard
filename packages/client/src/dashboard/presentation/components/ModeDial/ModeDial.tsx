import * as React from 'react';
import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import MenuIcon from '@mui/icons-material/Menu';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import IosShareIcon from '@mui/icons-material/IosShare';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import ModeEditIcon from '@mui/icons-material/ModeEdit';

interface ModeDialProps {
  className?: string;
}

export default function ModeDial({ className }: ModeDialProps) {
  return (
    <Box
      className={className}
      sx={{ height: 270, transform: 'translateZ(0px)', flexGrow: 1 }}
    >
      <SpeedDial ariaLabel="SpeedDial basic example" icon={<MenuIcon />}>
        <SpeedDialAction
          icon={<ModeEditIcon />}
          tooltipTitle={'EditMode'}
          onClick={() => {
            console.log('EditMode');
          }}
        />
        <SpeedDialAction
          icon={<FullscreenIcon />}
          tooltipTitle={'Fullscreen'}
          onClick={() => {
            console.log('FullScreen');
          }}
        />
        <SpeedDialAction
          icon={<IosShareIcon />}
          tooltipTitle={'Export'}
          onClick={() => {
            console.log('Export');
          }}
        />
      </SpeedDial>
    </Box>
  );
}
