import { Button, ListItem, ListItemText, TextField } from '@mui/material';
import { tableName } from 'common/src';
import { useState } from 'react';
import camelize from '../../../application/utils/camelize';
import { SelectedLabelFilters } from './InputLabels';

interface PropType {
  idx: number;
  data: SelectedLabelFilters;
  setLabels?: React.Dispatch<React.SetStateAction<string[]>>;
  setSelectedLabels?: React.Dispatch<
    React.SetStateAction<SelectedLabelFilters[]>
  >;
  removeFilter: (idx: number) => void;
}

export default function SelectedFilter(props: PropType) {
  const {
    idx,
    data: { label, latest, entityName, column, givenValue, operator },
    removeFilter,
    setLabels,
    setSelectedLabels,
  } = props;
  const [editmode, setEditmode] = useState(false);
  const [value, setValue] = useState(label);

  function FilterText() {
    return (
      <ListItemText
        primary={label}
        secondary={`${
          tableName[camelize(entityName) as keyof typeof tableName]
        }의 ${column}이 ${givenValue}고 operator는 ${operator}이고 latest는 ${latest}입니다.`}
      />
    );
  }

  function EditText() {
    return (
      <TextField
        autoFocus={true}
        variant="standard"
        placeholder={value}
        value={value}
        onChange={EditLabel}
      />
    );
  }

  function EditLabel(e: any) {
    setValue(e.target.value);
  }

  function onClick() {
    setEditmode((prev) => {
      if (prev && setLabels && value && setSelectedLabels) {
        setLabels((prevLabels) => {
          const newLabels = [...prevLabels];
          newLabels[idx] = value;
          return newLabels;
        });
        setSelectedLabels((prevLabels) => {
          const newLabels = [...prevLabels];
          newLabels[idx].label = value;
          return newLabels;
        });
      }
      return !prev;
    });
  }

  return (
    <ListItem key={idx}>
      {editmode ? <EditText /> : <FilterText />}
      {setLabels && <Button onClick={onClick}>수정</Button>}
      <Button onClick={() => removeFilter(idx)}>delete</Button>
    </ListItem>
  );
}
