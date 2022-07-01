import { ExpandLess, ExpandMore, SvgIconComponent } from '@mui/icons-material';
import {
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { ReactNode, useState } from 'react';

export interface SideBarListProps {
  children: ReactNode;
  label: string;
  icon: SvgIconComponent; // mui/icons-material 에 있는 아이콘 타입
}

function SideBarList(props: SideBarListProps) {
  const { children, label, icon } = props;
  const [open, setOpen] = useState(true);
  const ListIcon = icon;
  const handleOpen = () => {
    setOpen(!open);
  };

  return (
    <>
      <ListItemButton onClick={handleOpen}>
        <ListItemIcon>
          <ListIcon />
        </ListItemIcon>
        <ListItemText primary={label} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {children}
        </List>
      </Collapse>
    </>
  );
}

export default SideBarList;
