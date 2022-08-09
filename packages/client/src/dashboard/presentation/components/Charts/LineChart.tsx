import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { ChartProps, backgroundColor, borderColor } from './ChartData';
import useGqlQuery from '../../../application/services/useDataset';

Chart.register(...registerables);

export default function LineChart(props: ChartProps) {
  const { labels, queryData, datasetNames, options } = props;
  const { data, loading, error } = useGqlQuery(queryData);
  const datasets = [];
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        callbacks: {
          afterLabel: function (tooltipItem: any) {
            let total = 0;
            tooltipItem.dataset.data.map((data: number) => {
              total += data;
            });
            return `${((tooltipItem.raw / total) * 100).toFixed(2)}%`;
          },
        },
      },
    },
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
    datasets: datasets.map((dataset, idx) => ({
      label: datasetNames[idx],
      data: dataset,
      backgroundColor: backgroundColor[idx],
      borderColor: borderColor[idx],
      borderWidth: 2,
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
