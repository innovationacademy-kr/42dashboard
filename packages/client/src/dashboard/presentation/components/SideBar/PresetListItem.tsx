import { SvgIconComponent } from '@mui/icons-material';
import { ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import useMode from '../../../application/services/useMode';
import { useState } from 'react';
import TextField from '@mui/material/TextField';
import useBoard from '../../../application/services/useBoard';
import { useEffect } from 'react';
import usePreset from '../../../application/services/usePreset';

export interface PresetListItemProps {
  icon: SvgIconComponent; // mui/icons-material 에 있는 아이콘 타입
  label: string;
  description?: string;
  selected?: boolean;
  onClick?: () => void;
  changePresetLabel: (id: string, label: string) => void;
  id: string;
  deletePreset: (id: string) => void;
}

function PresetListItem(props: PresetListItemProps) {
  const {
    icon,
    label,
    onClick,
    selected,
    changePresetLabel,
    id,
    deletePreset,
  } = props;
  const [presetLabel, setPresetLabel] = useState(label);
  const { getControlMode } = useMode();
  const IconType = icon;

  useEffect(() => {
    changePresetLabel(id, presetLabel);
  }, [getControlMode()]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPresetLabel(event.target.value);
  };
  return (
    <ListItemButton
      sx={{ pl: 4 }}
      onClick={() => {
        if (getControlMode() !== 'edit') onClick?.();
      }}
      selected={selected}
    >
      <ListItemIcon>
        {getControlMode() === 'edit' ? (
          <DeleteIcon color="disabled" onClick={() => deletePreset(id)} />
        ) : (
          <IconType />
        )}
      </ListItemIcon>
      {getControlMode() === 'edit' ? (
        <TextField
          id="outlined-name"
          label="Name"
          value={presetLabel}
          onChange={handleChange}
        />
      ) : (
        <ListItemText primary={presetLabel} />
      )}
    </ListItemButton>
  );
}

export default PresetListItem;
