import { useLazyQuery } from '@apollo/client';
import { ListItem, ListItemText } from '@mui/material';
import { useState } from 'react';
import createModificationDataQuery from '../../../infrastructure/http/graphql/createModificationDataQuery';
import SaveButton from './SaveButton';

export interface EntityListItemProps {
  entityName: string;
}

const NOT_FOUND = 'Cannot convert undefined or null to object';
const CONFLICT = (entityName: string): string =>
  `Invalid requests[0].addSheet: A sheet with the name "${entityName}" already exists. Please enter another name.`;
const SERVER_ERROR = 'Failed to fetch';

export default function EntityListItem(props: EntityListItemProps) {
  const { entityName } = props;
  const [disabled, setDisabled] = useState<boolean>(true);

  const [loadDataSheet, { data, loading, error }] = useLazyQuery(
    createModificationDataQuery(entityName),
  );
  if (entityName === 'userBlackhole')
    console.log('&&&', loadDataSheet, '&&&', data, '¶¶¶', loading, error);

  if (error) {
    if (error.message === NOT_FOUND) {
      alert('엔티티가 존재하지 않습니다.');
    } else if (error.message === CONFLICT(entityName)) {
      alert('엔티티가 이미 존재합니다.');
    } else if (error.message === SERVER_ERROR) {
      alert('엔티티를 불러오는데 실패했습니다.');
    } else {
      return <ListItem>{error.message}</ListItem>;
    }
  }
  if (loading) return <ListItem>데이터 생성중...</ListItem>;

  return (
    <ListItem
      button
      onClick={async () => {
        await loadDataSheet();
        if (data) {
          console.log('data received', data);
          setDisabled(false);
          window.open(data['getDataToModifyFromDB'], '_blank');
        }
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
