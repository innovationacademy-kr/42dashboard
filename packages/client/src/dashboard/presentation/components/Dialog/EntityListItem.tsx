import { ListItem, ListItemText } from '@mui/material';
import { useState } from 'react';
import RequestButton from './RequestButton';
import SaveButton from './SaveButton';

export interface EntityListItemProps {
  entityName: string;
}
export default function EntityListItem(props: EntityListItemProps) {
  const { entityName } = props;
  const [request, setRequest] = useState<boolean>(false);
  const [save, setSave] = useState<boolean>(false);
  const [retry, setRetry] = useState<boolean>(false);

  function saveModification(e: any) {
    e.stopPropagation();
    setRequest(false);
    setSave(true);
  }

  function checkSucessSave(e: any) {
    e.stopPropagation();
    setSave(false);
  }

  function retrySave(e: any) {
    e.stopPropagation();
    setRetry((prev) => !prev);
  }

  return (
    <ListItem
      button
      onClick={() => {
        setRequest(true);
      }}
    >
      <ListItemText primary={entityName} />
      {request && (
        <SaveButton
          entityName={entityName}
          saveModification={saveModification}
        />
      )}
      {save && (
        <RequestButton
          retrySave={retrySave}
          entityName={entityName}
          checkSucessSave={checkSucessSave}
        />
      )}
    </ListItem>
  );
}
