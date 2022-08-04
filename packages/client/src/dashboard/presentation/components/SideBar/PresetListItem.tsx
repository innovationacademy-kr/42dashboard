import { SvgIconComponent } from '@mui/icons-material';
import { ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import useMode from '../../../application/services/useMode';
import { useState } from 'react';
import TextField from '@mui/material/TextField';
import useBoard from '../../../application/services/useBoard';
import usePreset from '../../../application/services/usePreset';
export interface PresetListItemProps {
  icon: SvgIconComponent; // mui/icons-material 에 있는 아이콘 타입
  label: string;
  description?: string;
  selected?: boolean;
  onClick?: () => void;
  changePresetLabel: (id: string, label: string) => void;
  id: string;
}

function PresetListItem(props: PresetListItemProps) {
  const { icon, label, onClick, selected, changePresetLabel, id } = props;
  const [edit, setEdit] = useState(false);
  const [presetLabel, setPresetLabel] = useState(label);
  const { getControlMode } = useMode();
  const { handleDeletePreset } = useBoard();
  const IconType = icon;

  function myOnClickHandler(e: any) {
    e.stopPropagation();
    changePresetLabel(id, presetLabel);
    setEdit(!edit);
  }

  async function deletePreset(id: string) {
    await handleDeletePreset(id);
    console.log('deletePreset: ', id);
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPresetLabel(event.target.value);
  };
  return (
    <ListItemButton
      sx={{ pl: 4 }}
      onClick={onClick || undefined}
      selected={selected || false}
    >
      <ListItemIcon>
        {selected && getControlMode() === 'edit' && !edit ? (
          <DeleteIcon color="disabled" onClick={() => deletePreset(id)} />
        ) : (
          <IconType />
        )}
      </ListItemIcon>
      {selected && getControlMode() === 'edit' && !edit ? (
        <>
          <TextField
            id="outlined-name"
            label="Name"
            value={presetLabel}
            onChange={handleChange}
          />
          <EditIcon color="disabled" onClick={myOnClickHandler} />
        </>
      ) : (
        <ListItemText primary={presetLabel} />
      )}
    </ListItemButton>
  );
}

export default PresetListItem;
