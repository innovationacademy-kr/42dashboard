import { EntityColumn, tableName } from 'common/src';
import { MenuItem } from '@mui/material';
import camelize from '../../../../../application/utils/camelize';

export default function returnEntities() {
  return () =>
    Object.keys(EntityColumn).map((entity) => (
      <MenuItem key={entity} value={entity}>
        {tableName[camelize(entity) as keyof typeof tableName]}
      </MenuItem>
    ));
}
