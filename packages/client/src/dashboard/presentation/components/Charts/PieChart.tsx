import { Pie } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import useGqlQuery from '../../../application/services/useDataset';
import { ChartProps, backgroundColor, borderColor } from './ChartData';

Chart.register(...registerables);

export default function PieChart(props: ChartProps) {
  const { labels, queryData, datasetNames, options } = props;
  const { data, loading, error } = useGqlQuery(queryData);
  const datasets = [];

  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        callbacks: {
          title: function (tooltipItem: any) {
            return `${tooltipItem[0].dataset.label}`;
          },
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

  const pieData = {
    labels,
    datasets: datasets.map((dataset, idx) => ({
      label: datasetNames[idx],
      data: dataset,
      backgroundColor: backgroundColor,
      borderColor: borderColor,
      borderWidth: 1,
    })),
  };

  return (
    <Pie
      data={pieData}
      options={
        options ? Object.assign(defaultOptions, options) : defaultOptions
      }
    />
  );
}
