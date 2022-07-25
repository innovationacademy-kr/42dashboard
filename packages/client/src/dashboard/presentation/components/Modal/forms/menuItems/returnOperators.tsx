import { MenuItem } from '@mui/material';
import { Operator } from 'common/src';

export default function returnOperators() {
  return () =>
    Object.values(Operator).map((operator) => (
      <MenuItem key={operator} value={operator}>
        {operator}
      </MenuItem>
    ));
}
