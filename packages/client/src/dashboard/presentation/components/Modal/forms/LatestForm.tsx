import { Checkbox, FormControlLabel } from '@mui/material';
interface Props {
  id: string;
  value: boolean;
  onChange: (event: any) => void;
}

export default function LatestForm(props: Props) {
  const { id, value, onChange } = props;
  return (
    <FormControlLabel
      control={<Checkbox />}
      label={id}
      labelPlacement="top"
      checked={value}
      onChange={onChange}
    />
  );
}
