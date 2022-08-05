import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { useEffect, useState } from 'react';
import useChartDataset from '../../../application/services/useDataset';
import { ChartProps } from '../Charts/ChartData';

export type BachelorProps = ChartProps;

export default function BachelorStickerContent(props: BachelorProps) {
  const { labels, queryData } = props;
  const { data, loading, error } = useChartDataset(queryData);
  const [values, setValues] = useState<string[]>([]);

  useEffect(() => {
    if (data) setValues(Object.values(data));
  }, [data]);

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error!</div>;
  }

  function returnHead() {
    return labels.map((label) => (
      <TableCell key={label} align="center">
        {label}
      </TableCell>
    ));
  }

  function returnBody() {
    return values.map((val) => (
      <TableCell key={val} align={'right'} sx={{ minWidth: 100 }}>
        {val}
      </TableCell>
    ));
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: '500px' }}>
        <Table stickyHeader size="small" aria-label="sticky table">
          <TableHead>
            <TableRow>{returnHead()}</TableRow>
          </TableHead>
          <TableBody>
            <TableRow>{returnBody()}</TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
