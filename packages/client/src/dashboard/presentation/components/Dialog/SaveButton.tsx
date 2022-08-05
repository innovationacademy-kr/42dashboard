import { Alert, Button } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import createModificationDataQuery from '../../../infrastructure/http/graphql/createModificationDataQuery';
import { useQuery } from '@apollo/client';

export interface SaveButtonProps {
  entityName: string;
  saveModification: (e: any) => void;
}

export default function SaveButton(props: SaveButtonProps) {
  const { entityName, saveModification } = props;

  const { data, loading, error } = useQuery(
    createModificationDataQuery(entityName),
  );

  if (error) return <Alert severity="error">{error.message}</Alert>;
  if (loading) return <Button disabled={true}>데이터 로딩중...</Button>;
  if (data) {
    window.open(data['getDataToModifyFromDB'], '_blank');
    console.log(data);
    return (
      <Alert
        onClick={saveModification}
        icon={<SaveIcon fontSize="inherit" />}
        severity="info"
      ></Alert>
    );
  }

  return null;
}
