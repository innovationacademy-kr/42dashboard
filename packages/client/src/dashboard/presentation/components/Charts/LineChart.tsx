import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { data, options } from './ChartData';
import { ChartProps } from './Chart.stories';
Chart.register(...registerables);

/* Code For Storybook */
export function StoryLineChart(props: ChartProps) {
  return <Line data={props.data} options={props.options} />;
}

export default function LineChart() {
  return <Line data={data} options={options} />;
}
