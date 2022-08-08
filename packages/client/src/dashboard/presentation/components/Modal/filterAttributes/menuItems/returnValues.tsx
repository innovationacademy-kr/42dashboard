import { MenuItem } from '@mui/material';

export default function returnValues(dependencies: {
  [key: string]: string;
  data: any;
}) {
  const { column, entityName, data } = dependencies;

  const findValue = (data: any, entityName: string, column: string) => {
    if (data) {
      const entity = 'get' + entityName;
      const values: object[] = data[entity];
      return values.map((val: any) => val[column]);
    }
    return [];
  };

  if (data && column && entityName)
    return findValue(data, entityName, column).map((value: string) => (
      <MenuItem key={value} value={value ? value.toString() : ''}>
        {value}
      </MenuItem>
    ));
  return null;
}
