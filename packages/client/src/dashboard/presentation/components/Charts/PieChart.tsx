import { Pie } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import * as ChartData from './ChartData';
Chart.register(...registerables);

const PieChart = () => {
  return <Pie options={ChartData.options} data={ChartData.data} />;
};

export default PieChart;
