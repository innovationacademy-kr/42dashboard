import { SvgIconComponent } from '@mui/icons-material';
import { ListItemButton, ListItemIcon, ListItemText } from '@mui/material';

export interface SideBarListItemProps {
  icon: SvgIconComponent; // mui/icons-material 에 있는 아이콘 타입
  label: string;
  onClick?: () => void;
}

function SideBarListItem(props: SideBarListItemProps) {
  const { icon, label, onClick } = props;
  const IconType = icon;

  return (
    <ListItemButton sx={{ pl: 4 }} onClick={onClick || undefined}>
      <ListItemIcon>
        <IconType />
      </ListItemIcon>
      <ListItemText primary={label} />
    </ListItemButton>
  );
}

export default SideBarListItem;
