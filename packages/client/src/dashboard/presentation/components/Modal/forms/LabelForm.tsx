import { TextField } from '@mui/material';

export interface LabelFormPropsType {
  value: string;
  onChange: (event: any) => void;
}

export default function LabelForm(props: LabelFormPropsType) {
  const { value, onChange } = props;
  return (
    <TextField
      required
      label="라벨 이름"
      variant="standard"
      value={value}
      onChange={onChange}
    />
  );
}
