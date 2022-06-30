import { Box } from '@mui/system';
import { ReactNode } from 'react';
export interface MainAreaProps {
  children: ReactNode;
}
function MainArea(props: MainAreaProps) {
  return (
    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
      {props.children}
    </Box>
  );
}

export default MainArea;
