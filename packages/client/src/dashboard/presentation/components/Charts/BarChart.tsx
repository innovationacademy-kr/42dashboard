import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { ChartProps } from './ChartData';
import useChartDataset from '../../../application/services/useDataset';

Chart.register(...registerables);

export default function BarChart(props: ChartProps) {
  const { labels, queryData, options } = props;
  const { data, loading, error } = useChartDataset(queryData);
  const datasets = [];
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  const dataArray = Object.values(data);
  while (dataArray.length > 0) {
    datasets.push(dataArray.splice(0, labels.length));
  }
  const barData = {
    labels,
    datasets: datasets.map((dataset) => ({
      data: dataset,
      backgroundColor: ['#36A2EB', '#FF6384'],
    })),
  };

  return (
    <Bar
      data={barData}
      options={
        options ? Object.assign(defaultOptions, options) : defaultOptions
      }
    />
  );
}
