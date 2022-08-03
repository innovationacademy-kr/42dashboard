import { ComponentStory } from '@storybook/react';
import ColumnSelector from './ColumnSelector';

export default {
  title: 'Table/ColumnSelector',
  component: ColumnSelector,
};

const Template: ComponentStory<typeof ColumnSelector> = (args) => (
  <ColumnSelector {...args} />
);

export const Default = Template.bind({});
Default.args = {
  columns: [
    { id: '1', label: '이름' },
    { id: '2', label: '성별' },
    { id: '3', label: '나이' },
    { id: '4', label: '직업' },
  ],
  columnsVisibility: [true, true, true, true],
};
