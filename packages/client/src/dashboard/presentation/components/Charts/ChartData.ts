import { ChartOptions } from 'chart.js';
import { QueryDataType } from '../../../application/services/useDataset';

export const backgroundColor = [
  'rgba(255, 99, 132, 0.6)',
  'rgba(255, 159, 64, 0.6)',
  'rgba(255, 205, 86, 0.6)',
  'rgba(75, 192, 192, 0.6)',
  'rgba(54, 162, 235, 0.6)',
  'rgba(153, 102, 255, 0.6)',
  'rgba(201, 203, 207, 0.6)',
];
export const borderColor = [
  'rgb(255, 99, 132)',
  'rgb(255, 159, 64)',
  'rgb(255, 205, 86)',
  'rgb(75, 192, 192)',
  'rgb(54, 162, 235)',
  'rgb(153, 102, 255)',
  'rgb(201, 203, 207)',
];

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
