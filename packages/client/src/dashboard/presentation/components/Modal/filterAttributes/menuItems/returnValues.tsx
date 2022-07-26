import { MenuItem } from '@mui/material';

export default function returnValues(dependencies: {
  [key: string]: string;
  data: any;
}) {
  const { column, entityName, data } = dependencies;

  const findValue = (data: any, entityName: string, column: string) => {
    if (data) {
      const entity = 'get' + entityName;
      const datasets = [];
      for (let i = 0; i < data[entity].length; i++) {
        datasets.push(data[entity][i][column]);
      }
      return datasets;
    }
    return [];
  };

  return () => {
    if (data && column && entityName)
      return findValue(data, entityName, column).map((value: string) => (
        <MenuItem key={value} value={value}>
          {value}
        </MenuItem>
      ));
    return null;
  };
}
