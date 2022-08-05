import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { ChartProps } from './ChartData';
import useChartDataset from '../../../application/services/useDataset';

Chart.register(...registerables);

export default function LineChart(props: ChartProps) {
  const { labels, queryData, datasetNames, options } = props;
  const { data, loading, error } = useChartDataset(queryData);
  const datasets = [];
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  /** alias로 설정한 이름이 data object의 key값 */
  const dataArray = Object.values(data);
  while (dataArray.length > 0) {
    datasets.push(dataArray.splice(0, labels.length));
  }
  const lineData = {
    labels,
    datasets: datasets.map((dataset, index) => ({
      label: datasetNames[index],
      data: dataset,
      backgroundColor: ['#36A2EB', '#FF6384'],
    })),
  };

  return (
    <Line
      data={lineData}
      options={
        options ? Object.assign(defaultOptions, options) : defaultOptions
      }
    />
  );
}
