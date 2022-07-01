import { Pie } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { data, options } from './ChartData';
Chart.register(...registerables);

/* Code For Storybook */
export interface PieChartProps {
  data: {
    labels: Array<string>;
    datasets: [
      {
        label: string;
        backgroundColor: string;
        borderColor: string;
        data: Array<number>;
      },
    ];
  };
  options: {
    responsive: boolean;
    maintainAspectRatio: boolean;
  };
}

export function StoryPieChart(props: PieChartProps) {
  return <Pie data={props.data} options={props.options} />;
}

export default function PieChart() {
  return <Pie data={data} options={options} />;
}
