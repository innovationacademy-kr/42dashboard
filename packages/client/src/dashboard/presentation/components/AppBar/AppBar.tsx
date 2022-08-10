import Toolbar from '@mui/material/Toolbar';
import MuiAppBar from '@mui/material/AppBar';
import { ReactNode } from 'react';

export interface AppBarProps {
  children: ReactNode;
}

function AppBar(props: AppBarProps) {
  const { children } = props;

  return (
    <MuiAppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: 'white',
      }}
    >
      <Toolbar>{children}</Toolbar>
    </MuiAppBar>
  );
}

export default AppBar;
