import { ListItem, ListItemText } from '@mui/material';
import { tableName } from 'common/src';
import camelize from '../../../application/utils/camelize';
import { SelectedLabelFilters } from './InputLabels';

interface PropType {
  idx: number;
  data: SelectedLabelFilters;
  deleteButton?: () => void;
}

export default function SelectedFilter(props: PropType) {
  const {
    idx,
    data: { label, latest, entityName, column, givenValue, operator },
  } = props;
  return (
    <ListItem key={idx}>
      <ListItemText
        primary={label}
        secondary={`${
          tableName[camelize(entityName) as keyof typeof tableName]
        }의 ${column}이 ${givenValue}고 operator는 ${operator}이고 latest는 ${latest}입니다.`}
      />
    </ListItem>
  );
}
