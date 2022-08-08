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
import PresetListItem from './PresetListItem';

function SideBar() {
  const {
    presetList,
    changePresetList,
    preset,
    changePreset,
    createPreset,
    changePresetLabel,
    removePreset,
  } = usePreset();

  async function deletePreset(id: string) {
    await removePreset(id);
    changePresetList({
      presetInfos: presetList.presetInfos.filter(
        (presetInfo) => presetInfo.id !== id,
      ),
    });
    console.log('deletePreset: ', id);
  }

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
            <PresetListItem
              key={presetInfo.id}
              id={presetInfo.id}
              icon={ShowChart}
              label={presetInfo.label}
              description={presetInfo.description}
              deletePreset={deletePreset}
              onClick={() => changePreset(presetInfo.id)}
              selected={presetInfo.id === preset?.id}
              changePresetLabel={changePresetLabel}
            />
          ))}
          <SideBarListItem
            icon={Addchart}
            label="보드 추가"
            onClick={() => {
              createPreset();
            }}
          />
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
