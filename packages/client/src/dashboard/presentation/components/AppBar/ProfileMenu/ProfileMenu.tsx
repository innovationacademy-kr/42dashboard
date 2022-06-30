import { Button, Menu, MenuItem } from '@mui/material';
import { useState } from 'react';
import Profile, { ProfileProps } from '../Profile/Profile';

// 메뉴 아이템은 온클릭 이벤트를 받아야해.

export interface ProfileMenuProps {
  profile: ProfileProps;
  menuItems: ProfileMenuItemProps[];
}

export interface ProfileMenuItemProps {
  label: string;
  onClick: () => void;
}

export default function ProfileMenu(props: ProfileMenuProps) {
  const { profile, menuItems } = props;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Profile {...profile} onClick={handleClick} />
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {menuItems.map((menuItem) => {
          return (
            <MenuItem onClick={menuItem.onClick}>{menuItem.label}</MenuItem>
          );
        })}
      </Menu>
    </div>
  );
}
