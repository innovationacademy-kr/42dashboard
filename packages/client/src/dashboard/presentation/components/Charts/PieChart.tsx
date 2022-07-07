import { Pie } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { chartProps, chartColor, options } from './ChartData';
import { useQuery } from '@apollo/client';
import { ChartProps } from './Chart.stories';
Chart.register(...registerables);

/* Code For Storybook */
export function StoryPieChart(props: ChartProps) {
  return <Pie data={props.data} options={props.options} />;
}

export default function PieChart(props: chartProps) {
  const { query, filters } = props;
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
  return <Pie data={Data} options={options} />;
}
