import { Checkbox } from '@mui/material';

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

  return <Checkbox value={checked} onClick={handleChange} />;
}
