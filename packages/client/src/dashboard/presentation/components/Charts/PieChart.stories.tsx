import { Story } from '@storybook/react';
import { StoryPieChart, PieChartProps } from './PieChart';

export default {
  title: 'StoryPieChart',
  component: StoryPieChart,
};

const Template: Story<PieChartProps> = (args: PieChartProps) => (
  <StoryPieChart {...args} />
);

export const Default = Template.bind({});

const Labels = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

Default.args = {
  data: {
    labels: Labels,
    datasets: [
      {
        label: 'StoryPieChart',
        backgroundColor: '#72aee6',
        borderColor: '#4f94db',
        data: [2, 9, 5, 3, 6, 1, 9],
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
  },
};
