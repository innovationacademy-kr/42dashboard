import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { ChartProps, backgroundColor, borderColor } from './ChartData';
import useGqlQuery from '../../../application/services/useDataset';

Chart.register(...registerables);

export default function BarChart(props: ChartProps) {
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

  const dataArray = Object.values(data);
  while (dataArray.length > 0) {
    datasets.push(dataArray.splice(0, labels.length));
  }

  const barData = {
    labels,
    datasets: datasets.map((dataset, idx) => ({
      label: datasetNames[idx] ? datasetNames[idx] : 'Default',
      data: dataset,
      backgroundColor: backgroundColor[idx],
      borderColor: borderColor[idx],
      borderWidth: 1,
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
