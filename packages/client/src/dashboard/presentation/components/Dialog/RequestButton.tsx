import { useQuery } from '@apollo/client';
import { Alert, Button } from '@mui/material';
import createSaveModifiedDataQuery from '../../../infrastructure/http/graphql/createSaveModifiedDataQuery';
import DoneIcon from '@mui/icons-material/Done';
import SaveIcon from '@mui/icons-material/Save';
import { tableName } from 'common/src';

export interface RequestButtonProps {
  entityName: keyof typeof tableName;
  withDeleted: boolean;
  checkSucessSave: (e: any) => void;
  retrySave: (e: any) => void;
}

const SUCCESS = '수정된 데이터가 성공적으로 저장되었습니다.';

export default function RequestButton(props: RequestButtonProps) {
  const { entityName, withDeleted, checkSucessSave, retrySave } = props;
  const { data, loading, error } = useQuery(
    createSaveModifiedDataQuery(entityName, withDeleted ? 'Y' : 'N'),
  );

  if (error) return <Button disabled={true}>{error.message}.</Button>;
  if (loading) return <Button disabled={true}>데이터 저장중...</Button>;
  if (data) {
    if (data['saveModifiedDataFromSheet'] === SUCCESS)
      return (
        <Alert
          onClick={checkSucessSave}
          icon={<DoneIcon fontSize="inherit" />}
          severity="success"
        ></Alert>
      );
    else {
      alert(data['saveModifiedDataFromSheet']);
      return (
        <Alert
          onClick={retrySave}
          icon={<SaveIcon fontSize="inherit" />}
          severity="info"
        ></Alert>
      );
    }
  }

  return null;
}
