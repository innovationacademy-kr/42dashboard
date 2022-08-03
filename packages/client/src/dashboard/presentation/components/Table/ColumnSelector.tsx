import { Checkbox, FormControlLabel, Paper } from '@mui/material';
import { ColumnDataType } from './Table';

interface ColumnSelectorProps {
  columns: ColumnDataType[];
  columnsVisibility: boolean[];
  handleColumnVisibilityChange: (index: number) => void;
}

function ColumnSelector(props: ColumnSelectorProps) {
  const { columns, columnsVisibility, handleColumnVisibilityChange } = props;

  return (
    <Paper
      sx={{
        display: 'flex',
        justifyContent: 'flex-start',
        flexWrap: 'wrap',
        flexDirection: 'row',
        p: 0.5,
        m: 0,
      }}
      component="ul"
    >
      {columns.map((column, index) => {
        return (
          <FormControlLabel
            id="column-selector"
            key={index}
            control={
              <Checkbox
                checked={columnsVisibility[index]}
                onChange={() => handleColumnVisibilityChange(index)}
              />
            }
            label={column.label}
          />
        );
      })}
    </Paper>
  );
}

export default ColumnSelector;
