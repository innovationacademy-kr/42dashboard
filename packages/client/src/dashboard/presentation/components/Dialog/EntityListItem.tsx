import { ListItem, ListItemText } from '@mui/material';
import { tableName } from 'common/src';
import { useState } from 'react';
import RequestButton from './RequestButton';
import SaveButton from './SaveButton';
import WithButton from './WithButton';

export interface EntityListItemProps {
  entityName: keyof typeof tableName;
}
export default function EntityListItem(props: EntityListItemProps) {
  const { entityName } = props;
  const [request, setRequest] = useState<boolean>(false);
  const [save, setSave] = useState<boolean>(false);
  const [retry, setRetry] = useState<boolean>(false);
  const [withDeleted, setWithDeleted] = useState<boolean>(false);

  function saveModification(e: any) {
    e.stopPropagation();
    setRequest(false);
    setSave(true);
  }

  function checkSucessSave(e: any) {
    e.stopPropagation();
    setSave(false);
  }

  return (
    <ListItem
      button
      onClick={() => {
        setRequest(true);
      }}
    >
      <ListItemText primary={tableName[entityName]} />
      {request && (
        <SaveButton
          entityName={entityName}
          withDeleted={withDeleted}
          saveModification={saveModification}
        />
      )}
      {save && (
        <RequestButton
          retrySave={setRetry}
          withDeleted={withDeleted}
          entityName={entityName}
          checkSucessSave={checkSucessSave}
        />
      )}
      {!request && !save && (
        <WithButton checked={withDeleted} onChange={setWithDeleted} />
      )}
    </ListItem>
  );
}
