import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { chartColor, chartProps, options } from './ChartData';
import { ChartProps } from './Chart.stories';
import { useQuery } from '@apollo/client';
Chart.register(...registerables);

/* Code For Storybook */
export function StoryBarChart(props: ChartProps) {
  return <Bar data={props.data} options={props.options} />;
}

export default function BarChart({ query, filters }: chartProps) {
  const { loading, error, data } = useQuery(query, {
    variables: filters,
  });
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  const Data = {
    labels: Object.keys(data),
    datasets: [
      {
        backgroundColor: chartColor,
        data: Object.values(data),
      },
    ],
  };
  return <Bar data={Data} options={options} />;
}
