import { Typography } from '@mui/material';
import { ComponentStory } from '@storybook/react';
import AppBar, { AppBarProps } from './AppBar';
import Profile from './Profile/Profile';

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
Default.args = {
  title: 'Title',
  leftChildren: [appBarTitle],
  rightChildren: [Profile({ name: 'kilee' })],
};
