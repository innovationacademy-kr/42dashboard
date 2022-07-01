import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { data, options } from './ChartData';
import { ChartProps } from './Chart.stories';
Chart.register(...registerables);

/* Code For Storybook */
export function StoryBarChart(props: ChartProps) {
  return <Bar data={props.data} options={props.options} />;
}

export default function BarChart() {
  return <Bar data={data} options={options} />;
}
