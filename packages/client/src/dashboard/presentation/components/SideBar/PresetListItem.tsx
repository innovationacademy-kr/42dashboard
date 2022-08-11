import { SvgIconComponent } from '@mui/icons-material';
import { ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import useMode from '../../../application/services/useMode';
import { useState } from 'react';
import TextField from '@mui/material/TextField';
import { useEffect } from 'react';

export interface PresetListItemProps {
  icon: SvgIconComponent; // mui/icons-material 에 있는 아이콘 타입
  label: string;
  description?: string;
  selected?: boolean;
  changeSelectedPreset: () => void;
  changePresetLabel: (id: string, label: string) => void;
  id: string;
  deletePreset: (id: string) => void;
}

function PresetListItem(props: PresetListItemProps) {
  const {
    icon,
    label,
    changeSelectedPreset,
    selected,
    changePresetLabel,
    id,
    deletePreset,
  } = props;
  const [presetLabel, setPresetLabel] = useState(label);
  const { controlModeData } = useMode();
  const IconType = icon;

  useEffect(() => {
    console.log('changepresetlabe');
    changePresetLabel(id, presetLabel);
  }, [controlModeData]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPresetLabel(event.target.value);
  };
  return (
    <ListItemButton
      sx={{ pl: 4 }}
      onClick={changeSelectedPreset}
      selected={selected}
    >
      {controlModeData === 'edit' && selected ? (
        <>
          <ListItemIcon>
            <DeleteIcon color="disabled" onClick={() => deletePreset(id)} />
          </ListItemIcon>
          <TextField
            id="outlined-name"
            label="Name"
            value={presetLabel}
            onChange={handleChange}
          />
        </>
      ) : (
        <>
          <ListItemIcon>
            <IconType />
          </ListItemIcon>
          <ListItemText primary={presetLabel} />
        </>
      )}
    </ListItemButton>
  );
}

export default PresetListItem;
