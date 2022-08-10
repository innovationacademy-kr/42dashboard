import { Checkbox, FormControlLabel } from '@mui/material';

export interface WithButtonProps {
  checked: boolean;
  onChange: React.Dispatch<React.SetStateAction<boolean>>;
}
export default function WithButton(props: WithButtonProps) {
  const { checked, onChange } = props;

  function handleChange(e: any) {
    e.stopPropagation();
    onChange(!checked);
  }

  return (
    <FormControlLabel
      value="start"
      control={<Checkbox value={checked} onClick={handleChange} />}
      label="삭제된 데이터 포함"
      labelPlacement="start"
    />
  );
}
