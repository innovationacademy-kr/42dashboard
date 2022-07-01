import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import MuiAppBar from '@mui/material/AppBar';
import Profile from './Profile/Profile';
import Box from '@mui/material/Box';
import { ReactNode } from 'react';

export interface AppBarProps {
  title: string;
  leftChildren: ReactNode;
  rightChildren: ReactNode;
}

function AppBar(props: AppBarProps) {
  const freespace = <div style={{ flexGrow: 1 }}></div>;

  return (
    <MuiAppBar
      position="fixed"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Toolbar>
        {props.leftChildren}
        {freespace}
        {props.rightChildren}
      </Toolbar>
    </MuiAppBar>
  );
}

export default AppBar;
