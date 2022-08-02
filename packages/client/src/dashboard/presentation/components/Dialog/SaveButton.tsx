import { Button } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import createSaveModifiedDataQuery from '../../../infrastructure/http/graphql/createSaveModifiedDataQuery';
import { useLazyQuery } from '@apollo/client';

export interface SaveButtonProps {
  entityName: string;
  disabled: boolean;
  setDisabled: React.Dispatch<React.SetStateAction<boolean>>;
}
export default function SaveButton(props: SaveButtonProps) {
  const { entityName, disabled, setDisabled } = props;
  const [saveModifiedData, { loading, error }] = useLazyQuery(
    createSaveModifiedDataQuery(entityName),
  );
  if (error) return <Button disabled={true}>{error.message}</Button>;
  if (loading) return <Button disabled={true}>데이터 저장중...</Button>;

  function saveModification() {
    setDisabled(true);
    saveModifiedData();
  }

  return (
    <Button
      disabled={disabled}
      autoFocus
      color="inherit"
      onClick={saveModification}
    >
      <SaveIcon />
    </Button>
  );
}
