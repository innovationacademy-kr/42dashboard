import {
  Addchart,
  AssessmentSharp,
  ExtensionSharp,
  ShowChart,
} from '@mui/icons-material';
import { Box, Divider, Drawer, Toolbar } from '@mui/material';
import SideBarList from './SideBarList';
import SideBarListItem from './SideBarListItem';

function SideBar() {
  const drawerWidth = 240;
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto' }}>
        <SideBarList label="DashBoard" icon={AssessmentSharp}>
          <SideBarListItem icon={ShowChart} label="요약" />
          <SideBarListItem icon={ShowChart} label="프리셋112" />
          <SideBarListItem icon={Addchart} label="보드 추가" />
        </SideBarList>
        <Divider />
        <SideBarList label="Future" icon={ExtensionSharp}>
          <SideBarListItem icon={ShowChart} label="미래기능" />
        </SideBarList>
      </Box>
    </Drawer>
  );
}

export default SideBar;
