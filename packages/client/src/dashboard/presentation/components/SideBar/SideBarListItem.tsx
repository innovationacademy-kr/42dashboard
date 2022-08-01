import { SvgIconComponent } from '@mui/icons-material';
import { ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useState } from 'react';
import TextField from '@mui/material/TextField';

export interface SideBarListItemProps {
  icon: SvgIconComponent; // mui/icons-material 에 있는 아이콘 타입
  label: string;
  description?: string;
  selected?: boolean;
  onClick?: () => void;
  changePresetLabel: (id: string, label: string) => void;
  id: string;
}

function SideBarListItem(props: SideBarListItemProps) {
  const { icon, label, onClick, selected, changePresetLabel, id } = props;
  const [edit, setEdit] = useState(false);
  const [presetLabel, setPresetLabel] = useState('새 프리셋');
  const IconType = icon;

  function myOnClickHandler(e: any) {
    e.stopPropagation();
    changePresetLabel(id, presetLabel);
    console.log('edit');
    setEdit(!edit);
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
        <IconType />
      </ListItemIcon>
      {edit ? (
        <TextField
          id="outlined-name"
          label="Name"
          value={presetLabel}
          onChange={handleChange}
        />
      ) : (
        <ListItemText primary={label} />
      )}
      <EditIcon color="disabled" onClick={myOnClickHandler} />
    </ListItemButton>
  );
}

export default SideBarListItem;
