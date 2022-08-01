import {
  Addchart,
  AssessmentSharp,
  ExtensionSharp,
  ShowChart,
} from '@mui/icons-material';
import { Box, Divider, Drawer, Toolbar } from '@mui/material';
import usePreset from '../../../application/services/usePreset';
import SideBarList from './SideBarList';
import SideBarListItem from './SideBarListItem';

function SideBar() {
  const { presetList, preset, changePreset, createPreset, changePresetLabel } =
    usePreset();

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
          {presetList.presetInfos.map((presetInfo) => (
            <SideBarListItem
              key={presetInfo.id}
              id={presetInfo.id}
              icon={ShowChart}
              label={presetInfo.label}
              description={presetInfo.description}
              onClick={() => changePreset(presetInfo.id)}
              selected={presetInfo.id === preset?.id}
              changePresetLabel={changePresetLabel}
            />
          ))}
          {/* TODO(sonkang): label 수정이 필요없는 컴포넌트는 적용이 안되게끔 수정 */}
          <SideBarListItem
            icon={Addchart}
            id="hi"
            label="보드 추가"
            changePresetLabel={changePresetLabel}
            onClick={() => {
              createPreset();
            }}
          />
        </SideBarList>
        <Divider />
        <SideBarList label="Future" icon={ExtensionSharp}>
          <SideBarListItem
            icon={ShowChart}
            changePresetLabel={changePresetLabel}
            id="hi"
            label="미래기능"
          />
        </SideBarList>
      </Box>
    </Drawer>
  );
}

export default SideBar;
