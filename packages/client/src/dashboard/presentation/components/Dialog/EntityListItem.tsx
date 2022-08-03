import { useLazyQuery } from '@apollo/client';
import { ListItem, ListItemText } from '@mui/material';
import { useState } from 'react';
import createModificationDataQuery from '../../../infrastructure/http/graphql/createModificationDataQuery';
import SaveButton from './SaveButton';

export interface EntityListItemProps {
  entityName: string;
}
export default function EntityListItem(props: EntityListItemProps) {
  const { entityName } = props;
  const [disabled, setDisabled] = useState<boolean>(true);

  const [loadDataSheet, { data, loading, error }] = useLazyQuery(
    createModificationDataQuery(entityName),
  );

  if (error) return <ListItem>{error.message}</ListItem>;
  if (loading) return <ListItem>데이터 생성중...</ListItem>;
  if (data && !disabled) {
    window.open(data['getDataToModifyFromDB'], '_blank');
  }

  return (
    <ListItem
      button
      onClick={async () => {
        setDisabled(false);
        await loadDataSheet();
      }}
    >
      <ListItemText primary={entityName} />
      <SaveButton
        entityName={entityName}
        disabled={disabled}
        setDisabled={setDisabled}
      />
    </ListItem>
  );
}
