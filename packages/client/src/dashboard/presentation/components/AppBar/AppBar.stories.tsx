import { Typography } from '@mui/material';
import { ComponentStory } from '@storybook/react';
import AppBar, { AppBarProps } from './AppBar';
import ProfileMenu from './ProfileMenu/ProfileMenu';

export default {
  component: AppBar,
  title: 'AppBar',
};

const Template: ComponentStory<typeof AppBar> = (args: AppBarProps) => (
  <AppBar {...args} />
);

export const Default = Template.bind({});
const appBarTitle = (
  <Typography variant="h6" component="div">
    AppBarTitle
  </Typography>
);
const profile = { name: 'kilee', size: 48 };

const profileMenuItems = [
  {
    label: '마이페이지',
    onClick: () => {
      console.log('Click');
    },
  },
  {
    label: '로그아웃',
    onClick: () => {
      console.log('로그아웃');
    },
  },
];
const profileMenu = (
  <ProfileMenu menuItems={profileMenuItems} profile={profile} />
);

Default.args = {
  children: [appBarTitle, <div style={{ flexGrow: 1 }}></div>, profileMenu],
};
