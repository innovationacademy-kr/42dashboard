import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import useGqlQuery, {
  QueryDataType,
} from '../../../application/services/useDataset';
import { useEffect, useState } from 'react';
import { getRowsFromGqlResponse } from '../../../application/utils/tableQueryParse';
import useMode from '../../../application/services/useMode';
import ColumnSelector from './ColumnSelector';

type cellAlignType = 'inherit' | 'left' | 'center' | 'right' | 'justify';
interface ColumnGroupType {
  id: string; // === label
  label: string; // Column Name Type
  align?: cellAlignType; //  default : center,
  colSpan: number;
}

export interface ColumnDataType {
  id: string;
  label: string;
  minWidth?: number;
  align?: cellAlignType;
  format?: (value: number) => string;
}
export interface TableProps {
  columnGroups?: ColumnGroupType[];
  columns: ColumnDataType[];
  queryData: QueryDataType;
  visibleColumns: boolean[];
  // options?: TableOptions;
}

type TableCellType = string | number;

export function TableStickerContent(props: TableProps) {
  const { columnGroups, columns, queryData, visibleColumns } = props;
  const { data, loading, error } = useGqlQuery(queryData); // data는 row 배열
  const [rowsState, setRowsState] = useState<TableCellType[][]>([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const { getControlMode } = useMode();
  const mode = getControlMode();

  useEffect(() => {
    if (visibleColumns.length === 0) {
      visibleColumns.length = columns.length;
      visibleColumns.fill(false);
      visibleColumns.fill(true, 0, 3);
    }
  }, []);
  useEffect(() => {
    if (data) {
      setRowsState(getRowsFromGqlResponse(data));
    }
  }, [data]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error!</div>;
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: '500px' }}>
        <Table stickyHeader size="small" aria-label="sticky table">
          <TableHead>
            {columnGroups && (
              <TableRow>
                {columnGroups.map((columnGroup) => (
                  <TableCell
                    key={columnGroup.id}
                    colSpan={columnGroup.colSpan}
                    align={columnGroup.align || 'center'}
                  >
                    {columnGroup.label}
                  </TableCell>
                ))}
              </TableRow>
            )}
            <TableRow>
              {columns.map(
                (column, index) =>
                  visibleColumns[index] && (
                    <TableCell
                      key={column.id}
                      align={column.align || 'right'}
                      sx={{ minWidth: column.minWidth || 100 }}
                    >
                      {column.label}
                    </TableCell>
                  ),
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {rowsState
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => (
                <TableRow key={`${row[0]}${index}`}>
                  {row.map(
                    (cell, i) =>
                      visibleColumns[i] && (
                        <TableCell key={`${cell}${i}`} align="right">
                          {cell}
                        </TableCell>
                      ),
                  )}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rowsState.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
