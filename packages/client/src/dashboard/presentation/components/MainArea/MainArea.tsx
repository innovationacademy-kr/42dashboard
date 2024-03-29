import { Toolbar } from '@mui/material';
import { Box } from '@mui/system';
import { ReactNode } from 'react';
import Footer from '../Footer/Footer';

export interface MainAreaProps {
  children: ReactNode;
}
function MainArea(props: MainAreaProps) {
  return (
    <Box component="main" sx={{ flexGrow: 1 }}>
      <Toolbar />
      {props.children}
    </Box>
  );
}

export default MainArea;
