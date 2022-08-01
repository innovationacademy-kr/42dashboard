import { ChartOptions } from 'chart.js';
import { QueryDataType } from '../../../application/services/useDataset';

export const chartColor = [
  '#72aee6',
  '#c3c4c7',
  '#ff8085',
  '#f0c33c',
  '#1ed14b',
  '#2271b1',
  '#008a20',
];

export const chartBorderColor = [
  '#4f94db',
  '#a7aaad',
  '#f96369',
  '#dba617',
  '#00ba37',
  '#135e96',
  '#007107',
];

export const labels = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

export const data = {
  labels: labels,
  datasets: [
    {
      label: 'dataset 1',
      backgroundColor: chartColor[0],
      borderColor: chartBorderColor[0],
      data: [2, 9, 5, 3, 6, 1, 9],
    },
  ],
};

export const options = {
  responsive: true,
  maintainAspectRatio: false,
};

export interface ChartProps {
  labels: string[];
  datasetNames: string[];
  queryData: QueryDataType;
  options?: ChartOptions;
}
