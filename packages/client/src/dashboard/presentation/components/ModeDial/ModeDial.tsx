import * as React from 'react';
import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import MenuIcon from '@mui/icons-material/Menu';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import IosShareIcon from '@mui/icons-material/IosShare';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import ModeEditIcon from '@mui/icons-material/ModeEdit';

import { boardModeActions } from '../../../infrastructure/store/redux/actions';
import {
  useAppDispatch,
  useAppSelector,
} from '../../../infrastructure/store/redux/hooks';

export default function ModeDial() {
  const dispatch = useAppDispatch();
  const mode = useAppSelector((state) => state.mode);
  console.log(mode);
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
            dispatch(boardModeActions.changeMode('edit'));
          }}
        />
        <SpeedDialAction
          icon={<FullscreenIcon />}
          tooltipTitle={'Fullscreen'}
          onClick={() => {
            dispatch(boardModeActions.changeMode('fullscreen'));
          }}
        />
        <SpeedDialAction
          icon={<IosShareIcon />}
          tooltipTitle={'Export'}
          onClick={() => {
            dispatch(boardModeActions.changeMode('export'));
          }}
        />
      </SpeedDial>
    </Box>
  );
}
