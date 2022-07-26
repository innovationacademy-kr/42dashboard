import { EntityColumn } from 'common/src';
import { MenuItem } from '@mui/material';

export default function returnEntities() {
  return () =>
    Object.keys(EntityColumn).map((entity) => (
      <MenuItem key={entity} value={entity}>
        {entity}
      </MenuItem>
    ));
}
