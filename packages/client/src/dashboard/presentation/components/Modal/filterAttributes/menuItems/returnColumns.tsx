import { MenuItem } from '@mui/material';
import { EntityColumn } from 'common/src';

type EntityColumnType = typeof EntityColumn;

export default function returnColumns(dependencies: { [key: string]: string }) {
  const { entityName } = dependencies;
  if (entityName === 'None' || !entityName) return () => null;
  return () =>
    EntityColumn[entityName as keyof EntityColumnType].map(
      (column: { spName: string; dbName: string }) => (
        <MenuItem key={column.dbName} value={column.dbName}>
          {column.spName}
        </MenuItem>
      ),
    );
}
