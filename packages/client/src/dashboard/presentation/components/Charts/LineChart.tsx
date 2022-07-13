import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { ChartProps } from './ChartData';
import useChartDataset from '../../../application/services/useDataset';

Chart.register(...registerables);

export default function LineChart(props: ChartProps) {
  const { labels, queryData, options } = props;
  const { data, loading, error } = useChartDataset(queryData);
  const datasets = [];

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  const dataArray = Object.values(data);
  while (dataArray.length > 0) {
    datasets.push(dataArray.splice(0, labels.length));
  }
  const lineData = {
    labels,
    datasets: datasets.map((dataset) => ({
      data: dataset,
      backgroundColor: ['#36A2EB', '#FF6384'],
    })),
  };

  return <Line data={lineData} options={options} />;
}
