import { ComponentStory } from '@storybook/react';
import ProfileMenu, { ProfileMenuProps } from './ProfileMenu';

export default {
  component: ProfileMenu,
  title: 'ProfileMenu',
};

const Template: ComponentStory<typeof ProfileMenu> = (
  args: ProfileMenuProps,
) => <ProfileMenu {...args} />;

export const Default = Template.bind({});
