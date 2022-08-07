import { Alert, Button } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import createModificationDataQuery from '../../../infrastructure/http/graphql/createModificationDataQuery';
import { useQuery } from '@apollo/client';
import { tableName } from 'common/src';

export interface SaveButtonProps {
  entityName: keyof typeof tableName;
  withDeleted: boolean;
  saveModification: (e: any) => void;
}

export default function SaveButton(props: SaveButtonProps) {
  const { entityName, withDeleted, saveModification } = props;

  const { data, loading, error } = useQuery(
    createModificationDataQuery(entityName, withDeleted ? 'Y' : 'N'),
  );

  if (error) return <Alert severity="error">{error.message}</Alert>;
  if (loading) return <Button disabled={true}>데이터 로딩중...</Button>;
  if (data) {
    window.open(data['getDataToModifyFromDB'], '_blank');
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
