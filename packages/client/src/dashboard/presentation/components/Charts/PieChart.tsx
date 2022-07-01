import { Pie } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { data, options } from './ChartData';
import { ChartProps } from './Chart.stories';
Chart.register(...registerables);

/* Code For Storybook */
export function StoryPieChart(props: ChartProps) {
  return <Pie data={props.data} options={props.options} />;
}

export default function PieChart() {
  return <Pie data={data} options={options} />;
}
