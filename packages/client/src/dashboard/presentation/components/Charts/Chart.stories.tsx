import { Story } from '@storybook/react';
import {
  StickerBodyProps,
  StoryStickerBody,
} from '../Sticker/StoryStickerBody';

export interface ChartProps {
  data: {
    labels: Array<string>;
    datasets: [
      {
        label: string;
        backgroundColor: string;
        borderColor: string;
        data: Array<number>;
      },
    ];
  };
  options: {
    responsive: boolean;
    maintainAspectRatio: boolean;
  };
}

const Labels = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

export default {
  title: 'StoryChart',
  component: StoryStickerBody,
};

const Template: Story<StickerBodyProps> = (args: StickerBodyProps) => (
  <StoryStickerBody {...args} />
);

export const PieChart = Template.bind({});

PieChart.args = {
  content: 'PieChart',
  dataSet: {
    labels: Labels,
    datasets: [
      {
        label: 'StoryPieChart',
        backgroundColor: '#f0c33c',
        borderColor: '#dba617',
        data: [2, 9, 5, 3, 6, 1, 9],
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
  },
};

export const LineChart = Template.bind({});

LineChart.args = {
  content: 'LineChart',
  dataSet: {
    labels: Labels,
    datasets: [
      {
        label: 'StoryLineChart',
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

export const BarChart = Template.bind({});

BarChart.args = {
  content: 'BarChart',
  dataSet: {
    labels: Labels,
    datasets: [
      {
        label: 'StoryBarChart',
        backgroundColor: '#ff8085',
        borderColor: '#f96369',
        data: [2, 9, 5, 3, 6, 1, 9],
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
  },
};
