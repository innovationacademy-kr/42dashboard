import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

export interface GivenValueFormPropsType {
  id: string;
  value: string;
  onChange: (event: any) => void;
  menuItems: () => JSX.Element[] | null;
}

export default function FilterAttribute(props: GivenValueFormPropsType) {
  const { id, value, onChange, menuItems } = props;

  const menuItemsElement = menuItems();

  return (
    <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
      <InputLabel id={id}>{id}</InputLabel>
      <Select labelId={id} id={id} value={value} onChange={onChange} label={id}>
        {menuItemsElement ?? (
          <MenuItem value="None">
            <em>None</em>
          </MenuItem>
        )}
      </Select>
    </FormControl>
  );
}
