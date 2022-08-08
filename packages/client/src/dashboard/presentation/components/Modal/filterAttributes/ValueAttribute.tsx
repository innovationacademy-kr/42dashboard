import { useQuery } from '@apollo/client';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import createValueQuery from '../../../../infrastructure/http/graphql/createValueQuery';
import returnValues from './menuItems/returnValues';

export interface ValueAttributeProps {
  id: string;
  value: string;
  entityName: string;
  column: string;
  onChange: (event: any) => void;
}

export default function ValueAttribute(props: ValueAttributeProps) {
  const { id, value, onChange, entityName, column } = props;
  const { data, loading, error } = useQuery(
    createValueQuery(entityName, column),
  );

  if (loading) return <p>Loading...</p>;
  return (
    <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
      <InputLabel id={id}>{id}</InputLabel>
      <Select labelId={id} id={id} value={value} onChange={onChange} label={id}>
        {returnValues({ column, entityName, data }) ?? (
          <MenuItem value="None">
            {error && column !== 'None' ? <em>error :( </em> : <em>None</em>}
          </MenuItem>
        )}
      </Select>
    </FormControl>
  );
}
